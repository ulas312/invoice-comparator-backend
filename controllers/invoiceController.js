import Invoice from '../models/invoice.js';
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

export const uploadInvoice = [
  upload.single('file'),
  async (req, res) => {
    const { companyName, items } = req.body;
    const filePath = req.file.path;

    try {
      const invoice = await Invoice.create({
        user: req.user._id,
        companyName,
        items: JSON.parse(items),
        filePath,
      });
      res.status(201).json(invoice);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
];

export const getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find({ user: req.user._id });
    res.status(200).json(invoices);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const exportInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find({ user: req.user._id });
    const csv = invoices.map((invoice) => ({
      companyName: invoice.companyName,
      items: invoice.items,
      createdAt: invoice.createdAt,
    }));

    const csvString = [
      ['Company Name', 'Items', 'Created At'],
      ...csv.map((item) => [
        item.companyName,
        item.items
          .map((i) => `${i.productDescription} (${i.unit}): ${i.price}`)
          .join('; '),
        item.createdAt.toISOString(),
      ]),
    ]
      .map((e) => e.join(','))
      .join('\n');

    res.header('Content-Type', 'text/csv');
    res.attachment('invoices.csv');
    res.send(csvString);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
