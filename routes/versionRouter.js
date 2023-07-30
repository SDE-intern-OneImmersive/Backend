const express = require('express');
const VersionModel = require('../model/verModel');
const fetcher = require('./fetcher');
const router = express.Router();

router.get('/deployments/:name', (req, res) => {
    const { name } = req.params;
    fetcher.fetchDeployments(name, (error, filteredDeploymentNames) => {
    if (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
    console.log("sending deployment names - middleware")
      res.json({ deployments: filteredDeploymentNames });
    }
  });
  
  });


router.get('/', async (req, res) => {
    const versions = await VersionModel.find();
    res.json(versions);
});

router.get('/:id', async (req, res) => {
    const version = await VersionModel.findById(req.params.id);
    res.json(version);
});

router.delete('/:id', async (req, res) => {
    await VersionModel.findByIdAndDelete(req.params.id);
    res.json({ message: 'Version Deleted' });
});

router.put('/:id', async (req, res) => {
    const { name, active, ContainerTag, Registry, Username, Password } = req.body;
    const newVersion = { name, active, ContainerTag, Registry, Username, Password };
    console.log("New Version", newVersion);
    try {
        let updatedVersion = await VersionModel.findOneAndUpdate({
            "_id": ObjectId(req.
                params.id)
        }, { $set: newVersion }, { new: true });
        res.json(updatedVersion);
    }
    catch (err) {
        console.log(err);
    }
});

router.post('/', async (req, res) => {
    const newVersion = new VersionModel({
        name: req.body.name,
        active: req.body.active,
        ContainerTag: req.body.ContainerTag,
        Registry: req.body.Registry,
        Username: req.body.Username,
        Password: req.body.Password,
    });

    await newVersion.save()
        .then(newVersion => res.json(newVersion))
        .catch(err => console.error());
});

module.exports = router;
