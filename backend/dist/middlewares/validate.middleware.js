export const validate = (schema) => {
    return (req, _res, next) => {
        const result = schema.safeParse({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        if (!result.success) {
            next(result.error);
            return;
        }
        // Overwrite with parsed (coerced/transformed) data
        req.body = result.data.body;
        req.query = result.data.query ?? req.query;
        req.params = result.data.params ?? req.params;
        next();
    };
};
//# sourceMappingURL=validate.middleware.js.map