const axios = require("axios");
const DVID = require("./index.js");
const packageData = require("../package.json");
const repoInfoData = require("../test/repo_info.json");
const allReposInfo = require("../test/all_repos.json");

const api = new DVID({
  host: "https://emdata.janelia.org",
  username: "dvidconsole",
  application: "console-test",
});

const alternativeApi = new DVID({
  host: "https://emdata.janelia.org",
  port: "5678",
  basename: "alt",
  username: "dvidconsole",
  application: "console-test",
});

const defaultAPI = new DVID();

jest.mock("axios");

it("reports it's own version", async () => {
  const version = await api.version();
  expect(version).toEqual(packageData.version);
});

it("generates the correct host strings", () => {
  expect(api.hostString()).toEqual("https://emdata.janelia.org");
  expect(alternativeApi.hostString()).toEqual("https://emdata.janelia.org:5678/alt/");
  expect(defaultAPI.hostString()).toEqual("/");
});

it("creates the correct urls", () => {
  expect(api.createUrl("/api/repos/info")).toEqual(
    "https://emdata.janelia.org/api/repos/info?u=dvidconsole&app=console-test"
  );
  expect(alternativeApi.createUrl("/api/repos/info")).toEqual(
    "https://emdata.janelia.org:5678/alt/api/repos/info?u=dvidconsole&app=console-test"
  );
  expect(alternativeApi.createUrl("api/repos/info")).toEqual(
    "https://emdata.janelia.org:5678/alt/api/repos/info?u=dvidconsole&app=console-test"
  );
  expect(defaultAPI.createUrl("api/repos/info")).toEqual(
    "/api/repos/info?u=anonymous&app=dvidjs"
  );
  expect(defaultAPI.createUrl("/api/repos/info")).toEqual(
    "/api/repos/info?u=anonymous&app=dvidjs"
  );
});

const serverInfo = {
  Cores: "256",
  "DVID Version": "v0.9.9",
  "Datastore Version": "0.10.0",
  Host: "59524cf95fe3:8000",
  "Maximum Cores": "256",
  Mode: "read only",
  Note: "",
  "RPC Address": ":8001",
  "Server time": "2022-07-20 13:28:51.394086687 +0000 UTC m=+3058089.496712697",
  "Server uptime": "849h28m9.482235322s",
  "Storage backend":
    "filestore; gbucket; ngprecomputed; swift; badger; basholeveldb; filelog",
};

it("gets serverInfo", async () => {
  axios.get.mockResolvedValue({ data: serverInfo });
  const info = await api.serverInfo();
  expect(info).toEqual(serverInfo);
});

const serverTypes = {
  annotation: "github.com/janelia-flyem/dvid/datatype/annotation",
  keyvalue: "github.com/janelia-flyem/dvid/datatype/keyvalue",
  labelmap: "github.com/janelia-flyem/dvid/datatype/labelmap",
};

it("gets serverTypes", async () => {
  axios.get.mockResolvedValue({ data: serverTypes });
  const info = await api.serverTypes();
  expect(info).toEqual(serverTypes);
});

const serverCompiledTypes = {
  annotation: "github.com/janelia-flyem/dvid/datatype/annotation",
  float32blk: "github.com/janelia-flyem/dvid/datatype/imageblk/float32.go",
  googlevoxels: "github.com/janelia-flyem/dvid/datatype/googlevoxels",
  imagetile: "github.com/janelia-flyem/dvid/datatype/imagetile",
  keyvalue: "github.com/janelia-flyem/dvid/datatype/keyvalue",
  labelarray: "github.com/janelia-flyem/dvid/datatype/labelarray",
  labelblk: "github.com/janelia-flyem/dvid/datatype/labelblk",
  labelgraph: "github.com/janelia-flyem/dvid/datatype/labelgraph",
  labelmap: "github.com/janelia-flyem/dvid/datatype/labelmap",
  labelsz: "github.com/janelia-flyem/dvid/datatype/labelsz",
  labelvol: "github.com/janelia-flyem/dvid/datatype/labelvol",
  multichan16: "github.com/janelia-flyem/dvid/datatype/multichan16",
  rgba8blk: "github.com/janelia-flyem/dvid/datatype/imageblk/rgba8.go",
  roi: "github.com/janelia-flyem/dvid/datatype/roi",
  tarsupervoxels: "github.com/janelia-flyem/dvid/datatype/tarsupervoxels",
  uint16blk: "github.com/janelia-flyem/dvid/datatype/imageblk/uint16.go",
  uint32blk: "github.com/janelia-flyem/dvid/datatype/imageblk/uint32.go",
  uint64blk: "github.com/janelia-flyem/dvid/datatype/imageblk/uint64.go",
  uint8blk: "github.com/janelia-flyem/dvid/datatype/imageblk/uint8.go",
};

it("gets serverCompiledTypes", async () => {
  axios.get.mockResolvedValue({ data: serverCompiledTypes });
  const info = await api.serverCompiledTypes();
  expect(info).toEqual(serverCompiledTypes);
});

const load = {
  "GET requests": 0,
  "PUT requests": 0,
  "active CGo routines": 0,
  "file bytes read": 0,
  "file bytes written": 0,
  goroutines: 22,
  "handlers active": 0,
  "key bytes read": 0,
  "key bytes written": 0,
  "pending log messages": 0,
  "value bytes read": 0,
  "value bytes written": 0,
};

it("gets load", async () => {
  axios.get.mockResolvedValue({ data: load });
  const info = await api.load();
  expect(info).toEqual(load);
});



it("gets reposInfo", async () => {
  axios.get.mockResolvedValue({ data: allReposInfo });
  const info = await api.reposInfo();
  expect(info).toEqual(allReposInfo);
});


it("gets data from repo endpoint 'info'", async () => {
  axios.request.mockResolvedValue({ data: repoInfoData });
  const info = await api.repo({
    uuid: "2b6d75f1c6e348ce945e1a66eb2f6bf3",
    endpoint: "info",
  });
  expect(info).toEqual(repoInfoData);
});

it("posts data to repo endpoint 'info'", async () => {
  axios.request.mockResolvedValue({ data: repoInfoData });
  const info = await api.repo({
    uuid: "2b6d75f1c6e348ce945e1a66eb2f6bf3",
    endpoint: "info",
    method: "post",
    data: { test: "value"}
  });
  expect(info).toEqual(repoInfoData);
});


it("throws an error if repo endpoint or uuid is missing", async () => {
  await expect(async () => {
    await api.repo();
  }).rejects.toThrowError("uuid parameter is required to access repo data");

  await expect(async () => {
    await api.repo({uuid: "123456678"});
  }).rejects.toThrowError("endpoint parameter is required to access repo data");
});

it("throws an error if repo get is called with data parameter", async () => {
  await expect(async () => {
    await api.repo({uuid: "123456678", endpoint: "/info", data: {test: "value"}});
  }).rejects.toThrowError("Request data can only be sent with a post request. Please add {method: \"post\"} to your options.");
});

it("throws an error if node endpoint or uuid is missing", async () => {
  await expect(async () => {
    await api.node();
  }).rejects.toThrowError("UUID required to access node data");

  await expect(async () => {
    await api.node({uuid: "123456678"});
  }).rejects.toThrowError("endpoint required to access node data");
});

const nodeData = {
  Base: {
    Checksum: "No checksum",
    Compression: "LZ4 compression, level -1",
    DataUUID: "3de9db2953404bedb909f922fe53be42",
    KVStore: "basholeveldb @ /data1/dbs/public-data/db-fib25",
    LogStore: "write logs @ /data1/dbs/public-data/mutlog/fib25",
    Name: "synapses",
    RepoUUID: "2b6d75f1c6e348ce945e1a66eb2f6bf3",
    Syncs: [],
    Tags: {},
    TypeName: "annotation",
    TypeURL: "github.com/janelia-flyem/dvid/datatype/annotation",
    TypeVersion: "0.1",
    Versioned: true,
  },
  Extended: {},
};

it("gets data from node endpoint 'synapses/info'", async () => {
  axios.get.mockResolvedValue({ data:nodeData });
  const info = await api.node({
    uuid: "2b6d75f1c6e348ce945e1a66eb2f6bf3",
    endpoint: "synapses/info",
  });
  expect(info).toEqual(nodeData);
});



