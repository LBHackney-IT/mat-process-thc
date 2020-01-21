/* eslint-env node */
const { createDecipheriv, pbkdf2Sync } = require("crypto");
const { Router, json } = require("express");
const { request } = require("https");
const jwt = require("jsonwebtoken");

const processApiHost = process.env.PROCESS_API_HOST;
const processApiBaseUrl = process.env.PROCESS_API_BASE_URL;
const processApiJwtSecret = process.env.PROCESS_API_JWT_SECRET;
const processApiKey = process.env.PROCESS_API_KEY;

const matApiHost = process.env.MAT_API_HOST;
const matApiBaseUrl = process.env.MAT_API_BASE_URL;
const matApiJwtSecret = process.env.MAT_API_JWT_SECRET;
const matApiDataSharedKey = process.env.MAT_API_DATA_SHARED_KEY;
const matApiDataSalt = process.env.MAT_API_DATA_SALT;
const matApiDataIterations =
  process.env.MAT_API_DATA_ITERATIONS &&
  parseInt(process.env.MAT_API_DATA_ITERATIONS);
const matApiDataKeyLength =
  process.env.MAT_API_DATA_KEY_SIZE &&
  parseInt(process.env.MAT_API_DATA_KEY_SIZE) / 8;
const matApiDataAlgorithm = process.env.MAT_API_DATA_ALGORITHM;
const matApiDataIV = process.env.MAT_API_DATA_IV;

const router = Router();

const verifyJwt = (token, secret) => {
  try {
    return jwt.verify(token, secret);
  } catch (err) {
    console.error(err);

    return;
  }
};

const decryptJson = (
  data,
  sharedKey,
  salt,
  iterations,
  keyLength,
  algorithm,
  iv
) => {
  const encryptedJson = decodeURIComponent(data);

  const key = pbkdf2Sync(sharedKey, salt, iterations, keyLength, algorithm);
  const decipher = createDecipheriv("aes-256-cbc", key, iv);

  const encrypted = Buffer.from(encryptedJson, "base64");
  const decrypted = decipher.update(encrypted);

  return JSON.parse(Buffer.concat([decrypted, decipher.final()]));
};

const proxy = (options, req, res) => {
  const clientReq = request(options, proxyRes => {
    res.status(proxyRes.statusCode);

    proxyRes.on("data", chunk => {
      res.write(chunk);
    });

    proxyRes.on("close", () => {
      res.end();
    });

    proxyRes.on("end", () => {
      res.end();
    });
  });

  clientReq.on("error", err => {
    console.error(`> An error occurred for ${req.method} ${req.path}`);
    console.error(err);

    try {
      res.status(500).send(err.message);
    } catch (e) {
      console.error("> An error occurred while sending an error response");
      console.error(e);
    }

    res.end();
  });

  if (req.body) {
    clientReq.write(JSON.stringify(req.body));
  }

  clientReq.end();
};

router.use(json({ limit: "1gb" }));

router.get("/v1/process/:ref/processData", (req, res) => {
  const { ref } = req.params;

  if (!verifyJwt(req.query.jwt, processApiJwtSecret)) {
    res.status(401).send("Invalid JWT");

    return;
  }

  const options = {
    host: processApiHost,
    port: 443,
    path: `${processApiBaseUrl}/v1/processData/${ref}`,
    method: req.method,
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": processApiKey
    }
  };

  proxy(options, req, res);
});

router.patch("/v1/process/:ref/processData", (req, res) => {
  const { ref } = req.params;

  if (!verifyJwt(req.query.jwt, processApiJwtSecret)) {
    res.status(401).send("Invalid JWT");

    return;
  }

  const options = {
    host: processApiHost,
    port: 443,
    path: `${processApiBaseUrl}/v1/processData/${ref}`,
    method: req.method,
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": processApiKey
    }
  };

  req.body = {
    processRef: ref,
    processDataToUpdate: req.body
  };

  proxy(options, req, res);
});

router.get("/v1/tenancies", (req, res) => {
  if (!verifyJwt(req.query.jwt, matApiJwtSecret)) {
    res.status(401).send("Invalid JWT");

    return;
  }

  const { data } = req.query;

  const { matApiToken, contactId } = decryptJson(
    data,
    matApiDataSharedKey,
    matApiDataSalt,
    matApiDataIterations,
    matApiDataKeyLength,
    matApiDataAlgorithm,
    matApiDataIV
  );

  const options = {
    host: matApiHost,
    port: 443,
    path: `${matApiBaseUrl}/v1/Accounts/AccountDetailsByContactId?contactid=${contactId}`,
    method: req.method,
    headers: {
      "Content-Type": "application/json",
      Authorization: matApiToken
    }
  };

  proxy(options, req, res);
});

router.get("/v1/residents", (req, res) => {
  if (!verifyJwt(req.query.jwt, matApiJwtSecret)) {
    res.status(401).send("Invalid JWT");

    return;
  }

  const { data } = req.query;

  const { matApiToken, uprn } = decryptJson(
    data,
    matApiDataSharedKey,
    matApiDataSalt,
    matApiDataIterations,
    matApiDataKeyLength,
    matApiDataAlgorithm,
    matApiDataIV
  );

  const options = {
    host: matApiHost,
    port: 443,
    // This is intentionally `urpn` due to it being misnamed in the API.
    path: `${matApiBaseUrl}/v1/Contacts/GetContactsByUprn?urpn=${uprn}`,
    method: req.method,
    headers: {
      "Content-Type": "application/json",
      Authorization: matApiToken
    }
  };

  proxy(options, req, res);
});

module.exports = router;
