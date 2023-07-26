const express = require("express");
const router = express.Router();
const Model = require("../model/testmodel");
const { default: mongoose } = require("mongoose");

router.post("/create", (req, res) => {
    const newModel = new Model({
        name: req.body.name,
        Registry: req.body.registry
    });

    newModel
        .save()
        .then(newModel => res.json(newModel))
        .catch(err => console.error(err));
});

router.get("/", async (req, res) => {
    try {
        const models = await Model.find({});
        res.json(models);
    } catch (err) {
        res.status(500).json({ error: "An error occurred while fetching data." });
        console.error(err);
    }
});

router.get("/:id", async (req, res) => {
    try {
        const modelId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(modelId))
            return res.status(404).send("No model with that id");
            const model = await Model.findById(modelId);
            res.json(model);
    } catch (err) {
        res.status(500).json({ error: "An error occurred while fetching data." });
        console.error(err);
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const modelId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(modelId))
            return res.status(404).send("No model with that id");
            const deletedModel = await Model.findByIdAndDelete(modelId);
            res.json(deletedModel);
    } catch (err) {
        res.status(500).json({ error: "An error occurred while fetching data." });
        console.error(err);
    }
});

router.put("/:id", async (req, res) => {
    try {
        const modelId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(modelId))
            return res.status(404).send("No model with that id");
            let updatedModelData = {...req.body }; // spread operator to copy the object and avoid
            // changing the original object when removing the _id
            delete updatedModelData._id;
            const updateResult = await Model.updateOne({"_id": mongoose.Types.ObjectId(
                modelId)}, updatedModelData);
            res.json(updateResult);
    } catch (err) {
        res.status(500).json({ error: "An error occurred while fetching data." });
        console.error(err);
    }
});

// Exporting
module.exports = router;
