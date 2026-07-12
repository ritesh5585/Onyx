import mongoose from "mongoose";

export const buildCartStatsAggregation = (userId) => {
    const objectId = mongoose.Types.ObjectId.isValid(userId)
        ? new mongoose.Types.ObjectId(userId)
        : userId;

    return [
        {
            $match: {
                user: objectId
            }
        },
        { $unwind: { path: "$items" } },
        {
            $lookup: {
                from: "products",
                localField: "items.product",
                foreignField: "_id",
                as: "items.product"
            }
        },
        { $unwind: { path: "$items.product" } },
        {
            $addFields: {
                "items.price": {
                    $let: {
                        vars: {
                            matchingVariant: {
                                $filter: {
                                    input: "$items.product.variants",
                                    as: "variant",
                                    cond: {
                                        $eq: ["$$variant._id", "$items.variant"]
                                    }
                                }
                            }
                        },
                        in: {
                            $ifNull: [
                                { $arrayElemAt: ["$$matchingVariant", 0] },
                                "$items.product.price"
                            ]
                        }
                    }
                }
            }
        },
        {
            $group: {
                _id: "$_id",
                user: { $first: "$user" },
                items: { $push: "$items" },
                totalPrice: {
                    $sum: {
                        $multiply: [
                            "$items.quantity",
                            {
                                $ifNull: [
                                    {
                                        $ifNull: ["$items.price.amount", "$items.product.price.amount"]
                                    },
                                    0
                                ]
                            }
                        ]
                    }
                }
            }
        }
    ];
};