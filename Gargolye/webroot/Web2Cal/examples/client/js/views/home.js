

$(function(){


    W2CAPP.HomeView = Backbone.View.extend({
        _modelBinder: undefined,
        initialize: function(){
        },
        render:function () {
            this.$el.html(this.template({groups:[]}));
            var obj = this;

            return this;
        }
    });
});
