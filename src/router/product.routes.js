import { Router } from "express";
import { productModel } from "../models/Products.js";

const productRouter = Router();

productRouter.get("/", async (req, res) => {
    const { limit = 10, page = 1, sort = "" } = req.query;

    const query = {};

    if (req.query.category) {
        query.category = req.query.category;
    }

    if (req.query.status) {
        query.status = req.query.status;
    }
    const ParsedPage = Number(page);
    const skip = (ParsedPage - 1) * limit;

    try {
        const products = await productModel
            .find(query)
            .sort(sort === "asc" ? "price" : sort === "desc" ? "-price" : "")
            .skip(skip)
            .limit(limit);

        const count = await productModel.countDocuments(query);

        const totalPages = parseInt(count / limit);

        const hasNextPage = Number(ParsedPage < totalPages);
        const hasPrevPage = ParsedPage > 1;

        const prevPage = hasPrevPage ? ParsedPage - 1 : null;
        const nextPage = hasNextPage ? ParsedPage + 1 : null;

        const prevLink = hasPrevPage
            ? `${req.protocol}://${req.get("host")}${req.path
            }?page=${prevPage}&limit=${limit}`
            : null;

        const nextLink = hasNextPage
            ? `${req.protocol}://${req.get("host")}${req.path
            }?page=${nextPage}&limit=${limit}`
            : null;

        const report = {
            status: "success",
            payload: products,
            totalPages,
            prevPage,
            nextPage,
            page: ParsedPage,
            hasPrevPage,
            hasNextPage,
            prevLink,
            nextLink,
        };

        res.status(200).json(report);
    } catch (error) {
        const report = {
            status: "error",
            payload: error.message,
        };

        res.status(500).json(report);
    }
});

export default productRouter;