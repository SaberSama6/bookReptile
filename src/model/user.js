module.exports = class extends think.Model{
    async getUserByname(name) {
        return this.table('user').where({ name: name }).find();
    }

    async getUserByfield(where) {
        return this.table('user').where(where).find();
    }

    async addUser(paylod) {
        return this.table('user').add(paylod);
    }
}