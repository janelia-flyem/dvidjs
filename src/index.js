const axios = require("axios").default;
const url = require("url");

class DVID {
  constructor(options) {
    options = options || {};
    var match = /(https?):\/\/(.*)/.exec(options.host);
    if (match) {
      options.host = match[2];
      options.protocol = match[1];
    }
    this.config = {
      host: options.host,
      port: options.port,
      protocol: options.protocol || "http",
      basename: options.basename || null,
      username: options.username || "anonymous",
      application: options.application || "dvidjs",
    };

    this.about = "This is the dvid api";
  }

  version() {
    return require(__dirname + "/../package.json").version;
  }

  hostString() {
    let hostString = "/";

    if (this.config.host) {
      hostString = this.config.protocol + "://" + this.config.host;
    }

    if (this.config.port) {
      hostString += ":" + this.config.port;
    }
    if (this.config.basename) {
      hostString += `/${this.config.basename}/`;
    }
    return hostString;
  }

  createUrl(path) {
    var hostString = this.hostString();

    // create the basic url from the hostname and the path string
    var url_string = url.resolve(hostString, path.replace(/^\//,''));

    // convert the string into an object so we can modify it.
    const url_obj = url.parse(url_string, true);

    // add the username and application to the query parameters
    url_obj.query["u"] = this.config.username;
    url_obj.query["app"] = this.config.application;

    // send back the final url as a string
    return url.format(url_obj);
  }

  async serverInfo() {
    const fullUrl = this.createUrl("api/server/info");
    const { data } = await axios.get(fullUrl);
    return data;
  }

  async serverTypes() {
    const fullUrl = this.createUrl("api/server/types");
    const { data } = await axios.get(fullUrl);
    return data;
  }

  async serverCompiledTypes() {
    const fullUrl = this.createUrl("api/server/compiled-types");
    const { data } = await axios.get(fullUrl);
    return data;
  }

  async load() {
    const fullUrl = this.createUrl("api/load");
    const { data } = await axios.get(fullUrl);
    return data;
  }

  async reposInfo() {
    const fullUrl = this.createUrl("api/repos/info");
    const { data } = await axios.get(fullUrl);
    return data;
  }

  async repo(options) {
    options = options || {};

    let method = 'get';
    if (options.method) {
      if (['get', 'post'].includes(options.method)) {
        method = options.method;
        delete options.method;
      } else {
        throw new Error("Only 'get' or 'post' methods are allowed");
      }
    }
    if (!Object.hasOwnProperty.call(options, 'uuid')) {
      throw new Error('uuid parameter is required to access repo data');
    }
    if (!Object.hasOwnProperty.call(options, 'endpoint')) {
      throw new Error('endpoint parameter is required to access repo data');
    }

    const fullUrl = this.createUrl(
      `api/repo/${options.uuid}/${options.endpoint}`
    );

    const requestConfig = { method, url: fullUrl };

    if (options.data) {
      if (method === 'post') {
        requestConfig.data = options.data
      }
      else {
        throw new Error('Request data can only be sent with a post request. Please add {method: "post"} to your options.');
      }
    }

    const { data } = await axios.request(requestConfig);
    return data;
  }

  async createRepo(options) {
    options = options || {};

    if (!Object.hasOwnProperty.call(options, 'alias')) {
      throw new Error('alias required to create data repository');
    }
    if (!Object.hasOwnProperty.call(options, 'description')) {
      throw new Error('description required to create data repository');
    }

    const fullUrl = this.createUrl("api/repos");
    await axios.post(fullUrl, options);
  }

  async node(options) {
    options = options || {};
    if (!Object.hasOwnProperty.call(options, 'uuid')) {
      throw new Error('UUID required to access node data');
    }
    if (!Object.hasOwnProperty.call(options, 'endpoint')) {
      throw new Error('endpoint required to access node data');
    }

    const fullUrl = this.createUrl(
      `api/node/${options.uuid}/${options.endpoint}`
    );
    const { data } = await axios.get(fullUrl);
    return data;
  }
}
module.exports = DVID;
