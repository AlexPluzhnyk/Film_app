class Api {
  constructor() {
    this._baseUrl = "http://api.tvmaze.com";
  }

  get(url) {
    return fetch(`${this._baseUrl}/${url}`).then((res) =>
      this._parseResponse(res)
    );
  }

  async _parseResponse(res) {
    return res.json();
  }
}

const api = new Api();

export default api;
