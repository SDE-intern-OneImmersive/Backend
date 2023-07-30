const express = require("express");
const router = express.Router();
const Model = require("../model/testmodel");
const { default: mongoose } = require("mongoose");
const k8s = require("@kubernetes/client-node");

const kubeconfigText = `
apiVersion: v1
clusters:
- cluster:
    certificate-authority-data: LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUMvVENDQWVXZ0F3SUJBZ0lSQU9aYmIxbVZkUk5pbkVZd05aR3d5TGd3RFFZSktvWklodmNOQVFFTEJRQXcKR0RFV01CUUdBMVVFQXhNTlkyOXlaWGRsWVhabExtTnZiVEFlRncweU1UQTRNall3TURNeU1qWmFGdzB6TVRBNApNall4TWpNeU1qWmFNQmd4RmpBVUJnTlZCQU1URFdOdmNtVjNaV0YyWlM1amIyMHdnZ0VpTUEwR0NTcUdTSWIzCkRRRUJBUVVBQTRJQkR3QXdnZ0VLQW9JQkFRRFkra0FTSzFOZFdwNW5XdExBN05mSS9rc3k0cU9mOWVZRGNxb00KemppODFHQUJlenNFSjBFc1NVclhpSUd6Z29TYkV3L1BKQXZDZGRURXRlTWQ0RU93NnNTVWU4SFFHV1dxcTBmVgpvdzMwanJQcWxramEzSmZhWWJMWi9Pc3A2enZXbml3eXNTVmJlQmJFTlFFL2RuVDN4UmdTTFl3TlJGcDcwZnU1CkJqbW9MZjhjYzdFMlp0TkF1cHRRVUJiMzdLSnlJYlJYOTdnV3B0QnJPOXN0ZWFTMUkwcGNTSHBvYWFBYzBIbGgKYkRNZTQyYkxFbjFkQ0tud1ZEWnBRSVAvTFc0UGM4NmEvYTJDZzZnMmJCcWhTWFFPNzBybHZ0aXVGYmwrTDZoRApxZU14ckl5MmR1MWE1VU9HcU9iTDkwczIxVE0vR3F5MTRaQU1ndVhsTFlCajVIWi9BZ01CQUFHalFqQkFNQTRHCkExVWREd0VCL3dRRUF3SUNwREFQQmdOVkhSTUJBZjhFQlRBREFRSC9NQjBHQTFVZERnUVdCQlNKTUpNUDJnOHAKeGxUelB4Ulp4cFkyZEFOMVVUQU5CZ2txaGtpRzl3MEJBUXNGQUFPQ0FRRUFEQWYxb3R2Y1FzZjZVODN2b0RvSAo3ZVhnSUdPUVZoMzh6VlgwSzh5cUV1ampjcDRZZ0o2OXJoektsQ3A3SGlMZEdzV3dmRkc3b25NeUtxYUNHSWJnCmFHc1NzVU9nOHhxelJ1UEpJU2RDa3B6VVdualNmRW03dU5vRlJJd0x6UHFmZ2IrWnJRNEdSaGFQMkxudkFKZ1oKbVNCczZMeDdGWnk0R2xYdlQ1QUhaMnNvSHdSMnNONEFqNjdkcHFzVk80QUcyZk0remg5MGZHTkRhSWxVeFVySwoxNGlUVW9IUVVlU2FhcTIrdkdWYmhlK2lOVW9DNTVmV29oL2svVm1PSVdyRnFwTW5IeFdKditHakRTZ3Q0WldWCk1qTVdCNFZsbWlCbmpEM25ib0dZVHJGVXd5M21GV2hnejNIanpRNzF2bDVlTnFaRzFtVGwycTRFUTBScE5Sd1kKRGc9PQotLS0tLUVORCBDRVJUSUZJQ0FURS0tLS0tCg==
    server: https://k8s.ord1.coreweave.com
  name: coreweave
contexts:
- context:
    cluster: coreweave
    namespace: tenant-74334f-oidev
    user: token-Kkn7HYfPzuXKApoTiaMk
  name: coreweave
current-context: coreweave
kind: Config
users:
- name: token-Kkn7HYfPzuXKApoTiaMk
  user:
    token: CHtnnc6xgtrQGH9pQ2P9cngsDCdzjpdQmfV7kF9C
`;

const kc = new k8s.KubeConfig();
kc.loadFromString(kubeconfigText);

var mmDeployment = {
  apiVersion: "apps/v1",
  kind: "Deployment",
  metadata: {
    name: "mm-deployment",
    labels: {
      app: "mm",
    },
  },
  spec: {
    replicas: 1,
    selector: {
      matchLabels: {
        app: "mm",
      },
    },
    template: {
      metadata: {
        labels: {
          app: "mm",
        },
      },
      spec: {
        containers: [
          {
            name: "mm-containers",
            image: "neerajpolavarapu/match:mo",
            imagePullPolicy: "Always",
            args: [
              "coturn.tenant-74334f-oidev.lga1.ingress.coreweave.cloud:3478",
              "PixelStreamingUser",
              "AnotherTURNintheroad",
              "neeraj",
              "gaddamvinay/repo:finalgame",
            ],
            ports: [
              {
                containerPort: 9999,
                protocol: "TCP",
              },
              {
                containerPort: 90,
                protocol: "TCP",
              },
              {
                containerPort: 9999,
                protocol: "UDP",
              },
              {
                containerPort: 90,
                protocol: "UDP",
              },
            ],
          },
        ],
      },
    },
  },
};

var mmIngress = {
  apiVersion: "networking.k8s.io/v1",
  kind: "Ingress",
  metadata: {
    name: "mm-ingress",
  },
  spec: {
    rules: [
      {
        host: "matchmaking.tenant-74334f-oidev.lga1.ingress.coreweave.cloud",
        http: {
          paths: [
            {
              path: "/",
              pathType: "Prefix",
              backend: {
                service: {
                  name: "mm-service",
                  port: {
                    number: 90,
                  },
                },
              },
            },
          ],
        },
      },
    ],
  },
};

var mmService = {
  apiVersion: "v1",
  kind: "Service",
  metadata: {
    name: "mm-service",
  },
  spec: {
    selector: {
      app: "mm",
    },
    ports: [
      {
        name: "backend-port-tcp",
        protocol: "TCP",
        port: 9999,
        targetPort: 9999,
      },
      {
        name: "backend-port-udp",
        protocol: "UDP",
        port: 9999,
        targetPort: 9999,
      },
      {
        name: "frontend-port-tcp",
        protocol: "TCP",
        port: 90,
        targetPort: 90,
      },
      {
        name: "frontend-port-udp",
        protocol: "UDP",
        port: 90,
        targetPort: 90,
      },
    ],
    type: "ClusterIP",
  },
};

const namespace = "tenant-74334f-oidev";

router.post("/create", (req, res) => {
  Model.findOne({ name: req.body.name })
    .then((existingModel) => {
      if (existingModel) {
        return res.status(400).json({ error: "Name already exists" });
      } else {
        const newModel = new Model({
          name: req.body.name,
          Registry: req.body.registry,
          Link:
            "matchmaking" +
            "-" +
            req.body.name +
            ".tenant-74334f-oidev.lga1.ingress.coreweave.cloud",
        });
        newModel
          .save()
          .then((savedModel) => res.json(savedModel))
          .catch((err) => {
            console.error(err);
            res.status(500).json({ error: "Failed to save the model" });
          });
        const deployname = newModel.name;
        const registryname = newModel.Registry;
        mmDeployment.metadata.name = "mm-deployment" + "-" + deployname;
        mmDeployment.metadata.labels.app = "mm" + "-" + deployname;
        mmDeployment.spec.selector.matchLabels.app = "mm" + "-" + deployname;
        mmDeployment.spec.template.metadata.labels.app =
          "mm" + "-" + deployname;
        mmDeployment.spec.template.spec.containers[0].name =
          "mm-containers" + "-" + deployname;
        mmDeployment.spec.template.spec.containers[0].args[3] = deployname;
        if (registryname.length > 0)
          mmDeployment.spec.template.spec.containers[0].args[4] = registryname;

      
        mmIngress.metadata.name = "mm-ingress" + "-" + deployname;
        mmIngress.spec.rules[0].host = "matchmaking" + "-" + deployname + ".tenant-74334f-oidev.lga1.ingress.coreweave.cloud";
        mmIngress.spec.rules[0].http.paths[0].backend.service.name = "mm-service" + "-" + deployname;
        
        
        
        mmService.metadata.name = "mm-service" + "-" + deployname;
        mmService.spec.selector.app = "mm" + "-" + deployname;

        const k8sApia = kc.makeApiClient(k8s.AppsV1Api);
        k8sApia.createNamespacedDeployment(namespace, mmDeployment);
        const k8sApib = kc.makeApiClient(k8s.CoreV1Api);
        k8sApib.createNamespacedService(namespace, mmService);
        const k8sApic = kc.makeApiClient(k8s.NetworkingV1Api);
        k8sApic.createNamespacedIngress(namespace, mmIngress);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "Database error" });
    });
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
    const id = req.params.id;
    const name = req.query.name;

    const tenantname = "tenant-74334f-oidev";
    var deploymentNamei = "mm-deployment" + "-" + name;
    var serviceNamei = "mm-service" + "-" + name;
    var ingressNamei = "mm-ingress" + + "-" + name;

    const k8sApi2 = kc.makeApiClient(k8s.AppsV1Api);
    k8sApi2
      .deleteNamespacedDeployment(deploymentNamei, tenantname)
      .then(() => {
        console.log(`Deleted deployment: ${deploymentNamei}`);
      })
      .catch((error) => {
        console.error(`Error deleting deployment: ${error}`);
      });

    const k8sApi3 = kc.makeApiClient(k8s.CoreV1Api);
    k8sApi3
      .deleteNamespacedService(serviceNamei, tenantname)
      .then(() => {
        console.log(`Deleted service: ${serviceNamei}`);
      })
      .catch((error) => {
        console.error(`Error deleting service: ${error}`);
      });

    
    const k8sApi4 = kc.makeApiClient(k8s.NetworkingV1Api);
    k8sApi4
      .deleteNamespacedIngress(ingressNamei, tenantname)
      .then(() => {
        console.log(`Deleted ingress: ${ingressNamei}`);
      })
      .catch((error) => {
        console.error(`Error deleting ingress: ${error}`);
      });

    
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
    let updatedModelData = { ...req.body }; // spread operator to copy the object and avoid
    // changing the original object when removing the _id
    delete updatedModelData._id;
    const updateResult = await Model.updateOne(
      {
        _id: mongoose.Types.ObjectId(modelId),
      },
      updatedModelData
    );
    res.json(updateResult);
  } catch (err) {
    res.status(500).json({ error: "An error occurred while fetching data." });
    console.error(err);
  }
});

// Exporting
module.exports = router;
