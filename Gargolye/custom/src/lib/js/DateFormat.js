function DateFmt() {
    this.dateMarkers = {
        d: ['getDate', function (v) { return ("0" + v).substr(-2, 2) } ],
        m: ['getMonth', function (v) { return ("0" + (v + 1)).substr(-2, 2) } ],
        n: ['getMonth', function (v) {
            var mthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            return mthNames[v];
        } ],
        w: ['getDay', function (v) {
            var dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
            return dayNames[v];
        } ],
        y: ['getFullYear'],
        H: ['getHours', function (v) { return ("0" + v).substr(-2, 2) } ],
        h: ['getHours', function (v) {
            h = ("0" + v).substr(-2, 2)
            if (h > 12) h = h - 12;
            return h;
        } ],
        M: ['getMinutes', function (v) { return ("0" + v).substr(-2, 2) } ],
        S: ['getSeconds', function (v) { return ("0" + v).substr(-2, 2) } ],
        i: ['toISOString', null],
        T: ['getHours', function (v) {
            h = ("0" + v).substr(-2, 2);
            if (h > 12) { return "PM"; }
            else { return "AM"; }
        } ]
    };

    this.format = function (date, fmt) {
        var dateMarkers = this.dateMarkers
        var dateTxt = fmt.replace(/%(.)/g, function (m, p) {
            var rv = date[(dateMarkers[p])[0]]()

            if (dateMarkers[p][1] != null) rv = dateMarkers[p][1](rv)

            return rv
        });

        return dateTxt
    }
}

