
module.exports = {
  get auth() {
    var auth = this.get('Authorization');
    if (!auth) return;

    // malformed
    var parts = auth.split(' ');
    if ('basic' != parts[0].toLowerCase()) return;
    if (!parts[1]) return;
    auth = parts[1];

    // credentials
    auth = new Buffer(auth, 'base64').toString().match(/^([^:]*):(.*)$/);
    if (!auth) return;
    return { user: auth[1], pass: auth[2] };
  }
};