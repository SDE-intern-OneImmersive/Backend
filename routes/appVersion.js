const express = require("express");
const router = express.Router();
const User = require("../model/User");
const Application = require("../model/Application");
const Version = require("../model/Version");
const { default: mongoose } = require("mongoose");
router.get("/:applicationId", async (req, res) => {
    try {
      const applicationID = req.params.applicationId;
      const application = await Application.findById(applicationID).populate('versions', 'versionname registry createdAt link');
      if (!application) {
        return res.status(404).json({ error: 'Application not found' });
      }
      const activeVersionID = application.activeversion;
      const responseArray = application.versions.map(version => {
        const formattedCreatedAt = new Date(version.createdAt).toLocaleString('en-IN', {
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            timeZoneName: 'short',
          });
        return {
          ApplicationName: application.name,
          versionname: version.versionname,
          registry: version.registry,
          createdAt: formattedCreatedAt,
          bool: version._id.equals(activeVersionID),
        };
      });
      return res.json(responseArray);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });
router.post("/createversion", async (req, res) => {
    Bname = req.body.name;
    Bregistry = req.body.registry;
    console.log("Have to create Version with name appname: " + Bname + " and registry: " + Bregistry);
    Application.findOne({ name: Bname})
    .populate('versions')
    .then((existingModel) => {
        if (!existingModel) {
            return res.status(404).json({ error: "Application not found" });
        }
        const latestVersion = existingModel.versions.length > 0
        ? existingModel.versions[existingModel.versions.length - 1].versionname
        : 0;
        const newVersionNumber = parseInt(latestVersion) + 1;
        const newVersionName = `${newVersionNumber}`;
        const newVersion = new Version({
            versionname: newVersionName,
            registry: Bregistry,
            link: "matchmaking" +
            "-" +
            req.body.name +
            ".tenant-74334f-oidev.lga1.ingress.coreweave.cloud",
            createdAt: Date.now(),
          });
          console.log("trying to create version with"+newVersion);
          newVersion.save()
          .then((createdVersion) => {
            console.log("Version created successfully   4"+ createdVersion);
            existingModel.versions.push(createdVersion._id);
            existingModel.activeversion = createdVersion._id;
            existingModel.save()
            .then(() => {
                console.log("Application model updated with new version");
                res.json({ message: "Version created and Application model updated successfully" });
              })
              .catch((error) => {
                console.error("Error updating Application model: ", error);
                res.status(500).json({ error: "Error updating Application model" });
              });
          })
          .catch((error) => {
            console.error("Error creating version: ", error);
            res.status(500).json({ error: "Error creating version" });
          });
    })
    .catch((error) => {
        console.error("Error finding application: ", error);
        res.status(500).json({ error: "Error finding application" });
      });
});


router.delete("/deleteversion", async (req, res) => {
    const { applicationName, versionName } = req.body;
    try {
      console.log("Here" + applicationName + " " + typeof versionName);
      const application = await Application.findOne({ name: applicationName });
      if (!application) {
        console.log("Here Application not found");
        return res.status(404).json({ message: 'Application not found.' });
      }
        let versionToDelete;
        for (const version of application.versions) {
            console.log(version + "    given here is       ---------")
            const versionObj = await Version.findById(version);
        if (versionObj.versionname === versionName) {
            versionToDelete = version;
            break;
        }
        }
      console.log("Here version is" + versionToDelete);
      if (!versionToDelete) {
        console.log("Version not found");
        return res.status(404).json({ message: 'Version not found.' });
      }
      if (application.activeversion && application.activeversion.equals(versionToDelete._id)) {
        console.log("Active version cannot be deleted");
        return res.status(400).json({ message: 'Active version cannot be deleted.' });
      }
      await Version.findByIdAndDelete(versionToDelete._id);
      application.versions.pull(versionToDelete._id);
      await application.save();
      res.json({ message: 'Version deleted successfully.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error.' });
    }
  });


  router.post('/activate', async (req, res) => {
    try {
      const { applicationName, versionName } = req.body;
  
      // Find the application with the provided name
      const application = await Application.findOne({ name: applicationName });
  
      if (!application) {
        return res.status(404).json({ error: 'Application not found.' });
      }
  
      // Find the version with the provided versionName
      const version = await Version.findOne({ versionname: versionName });
  
      if (!version) {
        return res.status(404).json({ error: 'Version not found.' });
      }
  
      // Update the active version with the provided versionId
      application.activeversion = version._id;
      await application.save();
  
      res.json({ message: 'Version activated successfully.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  });
  


module.exports = router;