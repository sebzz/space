function Set(initialData) {
    // can pass initial data for the set in an object
    this.data = initialData || {};
}

Set.prototype = {
    add: function(key, val) {
        if (typeof key === "object") {
            for (var index in key) {
                if (key.hasOwnProperty(index)) {
                    this.add(index, key[index]);
                }
            }
        } else {
            this.data[key] = val;
        }
    },
    get: function(key) {
        return this.data[key];
    },
    remove: function(key) {
        // can be one or more args
        // each arg can be a string key or an array of string keys
        var item;
        for (var j = 0; j < arguments.length; j++) {
            item = arguments[j];
            if (typeof key === "string") {
                delete this.data[item];
            } else if (item.length) {
                // must be an array of keys
                for (var i = 0; i < item.length; i++) {
                    delete this.data[item[i]];
                }
            }
        }
    },
    has: function(key) {
        return this.data.hasOwnProperty(key);
    },
    isEmpty: function() {
        for (var key in this.data) {
            if (this.data.hasOwnProperty(key)) {
                return false;
            }
        }
        return true;
    },
    keys: function() {
        return Object.keys(this.data);
    },
    clear: function() {
        this.data = {};
    }
};

(function() {
    var pressedKeys = new Set({});

    function setKey(event, status) {
        var code = event.keyCode;
        var key;

        switch(code) {
            case 32:
                key = 'SPACE'; break;
            case 37:
                key = 'LEFT'; break;
            case 38:
                key = 'UP'; break;
            case 39:
                key = 'RIGHT'; break;
            case 40:
                key = 'DOWN'; break;
            default:
                return;
                // Convert ASCII codes to letters
                //key = String.fromCharCode(code);
        }
        //var fn = status ? pressedKeys.add : pressedKeys.remove
        //fn(key);
        if (status) {
            pressedKeys.add(key);
        } else {
            pressedKeys.remove(key);
        }
    }

    document.addEventListener('keydown', function(e) {
        setKey(e, true);
    });

    document.addEventListener('keyup', function(e) {
        setKey(e, false);
    });

    window.addEventListener('blur', function() {
        pressedKeys.clear();
    });

    window.asteroidz.input = {

        pressedKeys: function() {
          return pressedKeys.keys()
        },
        isDown: function(key) {
            return pressedKeys.has(key.toUpperCase());
        }
    };
})();

