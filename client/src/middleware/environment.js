module.exports={
    server:{
        url: "https://api.flashgang.io/v1"
    },
    local: {
        url: "http://localhost:8080"
    },
    getEnvironment: function(url) {
        console.log("url", url);
        if (url.toLowerCase().indexOf('local')>-1 || url.indexOf('127')>-1) {
            console.log("url is ", url, "returning", this.local);
            return this.local;
        } else {
            console.log("url is ", url, "returning", this.server);
            return this.server;
        }
    }

}
