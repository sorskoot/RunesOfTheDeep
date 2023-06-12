const iron = {
    name: "Iron",
    
    initialize: function () {
        this.name = `Iron ${this.name}`;
    },

    attack(acc = 0) {
        if (acc > 0) {
            acc += 1
        }
        return acc
    },

    protection(acc = 0) {
        if (acc > 0) {
            acc += 1
        }
        return acc
    }
}

export default iron