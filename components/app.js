
var ListItem = React.createClass({
    propTypes: {
        "id": React.PropTypes.number,
        "name": React.PropTypes.string,
        "position": React.PropTypes.string,
        "number": React.PropTypes.number,
        "picture": React.PropTypes.string,
        "onDeleteButtonClicked": React.PropTypes.func,
    },

    render: function(){
        return (
            React.createElement("a", {className:"playerCard", href: "#item/" + this.props.id},
            React.createElement("li", {}),
            React.createElement("h2", {className:"playerName"},this.props.name),
            React.createElement("h4", {className:"position"}, this.props.position),
            React.createElement("h5", {className:"squadNum"}, "#" + this.props.number),
            React.createElement("img", {className:"squadPic", src: this.props.picture})
        )
        )
    }
}); 

var List = React.createClass({
    propTypes: {
        "items:": React.PropTypes.array,
        "deleteElement": React.PropTypes.func,
    },

    render: function(){
        var deleteElementCallBack = this.props.deleteElement;
        var listofListItems = this.props.items.map(function(item){
            item.onDeleteButtonClicked = deleteElementCallBack;
            return React.createElement(ListItem, item);
        });
        return (
            React.createElement("ul", {},
                listofListItems
        )
    );
    }
});

let AddNewForm = React.createClass({
    propTypes: {
        playerItem: React.PropTypes.object.isRequired,
        onChange: React.PropTypes.func.isRequired,
        onSubmit: React.PropTypes.func.isRequired
    },
    onNameChange: function(e) {
        this.props.onChange(Object.assign({}, this.props.playerItem, {name: e.target.value}));
    },
    onPositionChange: function(e) {
        this.props.onChange(Object.assign({}, this.props.playerItem, {position: e.target.value}));
    },
    onNumberChange: function(e) {
        this.props.onChange(Object.assign({}, this.props.playerItem, {number: e.target.value}));
    },
    onPictureChange: function(e) {
        this.props.onChange(Object.assign({}, this.props.playerItem, {picture: e.target.value}));
    },
    onSubmit: function(e) {
        this.props.onSubmit(this.props.playerItem);
    },
    render: function() {
        return (
            React.createElement("form", {},
                React.createElement("input", {
                    type: "text",
                    placeholder: "Name",
                    className:"position",
                    value: this.props.playerItem.name,
                    onChange: this.onNameChange
                }),
                React.createElement("input", {
                    type: "text",
                    placeholder: "Position",
                    className:"position",
                    value: this.props.playerItem.position,
                    onChange: this.onPositionChange
                }),
                React.createElement("input", {
                    placeholder: "Number",
                    className:"position",
                    value: this.props.playerItem.number,
                    onChange: this.onNumberChange
                }),
                React.createElement("input", {
                    placeholder: "Picture",
                    className:"position",
                    value: this.props.playerItem.picture,
                    onChange: this.onPictureChange
                }),
                React.createElement("a", {href: "#"},
                React.createElement("button", {className:"position", type: "button", onClick: this.onSubmit}, "Submit"))
            )
        )
    }
});

let FormView = React.createClass({
    propTypes: {
        playerItem: React.PropTypes.object.isRequired,
        items: React.PropTypes.array.isRequired,
        onNewPlayerItemChange: React.PropTypes.func.isRequired,
        onSubmitNewItem: React.PropTypes.func.isRequired
    },
    render: function() {
        return (
            React.createElement("div", {},
                React.createElement("div", {}),
                React.createElement(AddNewForm, {playerItem: this.props.playerItem, onChange: this.props.onNewPlayerItemChange, onSubmit: this.props.onSubmitNewItem}),
            )
        )
    }
});
function updateNewPlayerItem(item) {
    setState({playerItem: item});
}
function addNewItem(item) {
    let itemList = state.items;
    itemList.push(Object.assign({}, {key: itemList.length + 1, id: itemList.length + 1}, item));
    setState({items: itemList});
    console.log("New Item List: ", state.items);
}

let NavMenu = React.createClass({
    render: function() {
        return (
            React.createElement("ul", {className: "nav-menu"},
                React.createElement("li", {},
                    React.createElement("a", {href: "#"}, "Main View")
                ),
                React.createElement("li", {},
                    React.createElement("a", {href: "#newitem"}, "Add new item")
                )
            )
        )
    }
});

let MainPage = React.createClass({
    propTypes: {
        "id": React.PropTypes.number,
        "name": React.PropTypes.string,
        "position": React.PropTypes.string,
        "number": React.PropTypes.number,
        "picture": React.PropTypes.string,
        "onDeleteButtonClicked": React.PropTypes.func
    },
    render: function () {
        return (
            React.createElement("div", {},
                React.createElement(NavMenu, {}),
                React.createElement(List, state, {}),
               
            )
            
        )
    }
});

let AddNewItemPage = React.createClass({
    
    render: function() {
        return (
            React.createElement("div", {},
                React.createElement(NavMenu, {}),
                React.createElement("h2", {className:"playerName"}, "Add A Player"),
                React.createElement(FormView, Object.assign({}, state, {
                    onNewPlayerItemChange: updateNewPlayerItem,
                    onSubmitNewItem: addNewItem
                })),                
            )
        )
    }
});

let ItemPage = React.createClass({
   
    render: function() {
        return (
            React.createElement("div", {},
                React.createElement(NavMenu,{}),
                React.createElement("h2", {className:"playerName"},this.props.name),
                React.createElement("h4", {className:"position"}, this.props.position),
                React.createElement("h5", {className:"squadNum"}, "#" + this.props.number),
                React.createElement("img", {className:"squadPic", src: this.props.picture})
            )
        )
    }
});

var state = {
    location: ""
};

function setState(changes) {
    let component;
    let componentProperties = {};

    state.deleteElement = function(e){
        var elementID = e.target.id.split("-")[1];
        alert(elementID);

        var newArray = [];
        var items = state.items;
        for(var i = 0; i < items.length; i++){
            if (items[i].id != elementID) newArray.push(items[i]);
        }

        setState({items: newArray});
    };

    Object.assign(state, changes);

    let splittedUrl = state.location.replace(/^#\/?|\/$/g, "").split("/");

    switch(splittedUrl[0]) {
        case "newitem":
            component = AddNewItemPage;
            break;
        case "item":
            component = ItemPage;
            componentProperties = items.find(i => i.key == splittedUrl[1]);
            break;
        default:
            component = MainPage;
    }

    ReactDOM.render(React.createElement(component, componentProperties), document.getElementById("react-app"));
}

window.addEventListener('hashchange', ()=>setState({location: location.hash}));

setState({location: location.hash, 
    playerItem:{
        name: "",
        position: "",
        number: "",
        picture: ""
    },
    items: [
    {key: 1, id:1, name: "Ben Amos", position: "Goalkeeper", number: "1", picture: "https://www.cafc.co.uk/images/01d9f4d093b9a2ca3338cc3e129beafc5d329f8d875d7b97ef925060d3124d2418e73c0b839441d5.jpg"},
    {key: 2, id:2, name: "Ahmed Kashi", position: "Midfield", number: "3", picture: "https://www.cafc.co.uk/images/49d799ed3ca21240793701f40d0ba770b26585cece76c38b959ef16121777eb8bdf1ba7af622e41f.jpg"},
    {key: 3, id:3, name: "Josh Magennis", position: "Forward", number: "9", picture: "https://www.cafc.co.uk/images/e4a714ab8a6a99cb15b332dc3261b3d84a0ce38b8a31170f68f0a716c2956debceb4b65ac175a3a8.jpg"},
    {key: 4, id:4, name: "Mouhamadou-Naby Sarr", position: "Defender", number: "23", picture: "https://www.cafc.co.uk/images/1b5860147b4114a11e979c878ac09638e3e53e48c62ec16042782525d259cb088b6d56d127cf8a3c.jpg"},
    {key: 5, id:5, name: "Johnnie Jackson", position: "Midfielder", number: "4", picture: "https://www.cafc.co.uk/images/bda42fa0488e3f3a094ab5770d85b8de05aa760950b0933414bf925122a876cb39803d947a5b359d.jpg"}
]
});