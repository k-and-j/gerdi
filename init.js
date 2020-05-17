var x = {
    color: "blue"
};
var y = {};

const players = {
    x: {},
    y: {}
}
function use(init) {
    if(!x.color) {
        init(x)
    } else if(!y.color) {
        init(y)
    }
}
