Planck.Extension.Content.Module.Image.View.Component.ImageDetail = function(container)
{
    if(container) {
        this.setElement(container);
        this.initialize();
        this.loadDataLayerFromDom();
    }
    this.image = null;
    this.cropper = null;
    this.form = null


    this.events = {
        'beforeSubmit' : function(instance)
        {

        },
       'afterSubmit' : function(instance)
       {

       }
    };
};

Planck.Extension.Content.Module.Image.View.Component.ImageDetail.prototype.image;




Planck.Extension.Content.Module.Image.View.Component.ImageDetail.prototype.getRemoteCallInstance = function()
{
    return this.parent.getRemoteCallInstance.call(this,
        'Planck.Extension.Content.Module.Image.View.Component.ImageDetail'
    );
};


Planck.Extension.Content.Module.Image.View.Component.ImageDetail.prototype.getViewFromRemote = function(callback)
{
    this.parent.getViewFromRemote.call(
        this,

        'Planck.Extension.Content.Module.Image.View.Component.ImageDetail',
        null,
        function(descriptor) {
            this.initializeCropper();
            this.initializeForm();

            Planck.Extension.ViewComponent.initialize(this.getElement());

            if(callback) {
                callback(descriptor);
            }
        }.bind(this)
    );
};


Planck.Extension.Content.Module.Image.View.Component.ImageDetail.prototype.initializeCropper = function()
{

    var image = this.$element.find('.plk-image-detail-preview img').get(0);
    var cropOptions = {
        autoCrop: true
    };

    if(this.getDataLayer().get('image').getProperty('crop')) {
        var values = this.getDataLayer().get('image').getProperty('crop').value;
        for(var name in values) {
            values[name] = parseFloat(values[name]);
        }
        cropOptions.data = values;
    }

    this.cropper = new Cropper(image, cropOptions);
};


Planck.Extension.Content.Module.Image.View.Component.ImageDetail.prototype.initializeForm = function()
{




    var formElement = this.$element.find('form.image-data-form');
    this.form = new Khi.AjaxForm(formElement);
    if(this.cropper) {
        this.form.on('beforeSubmit', function() {
            this.form.addData('crop', this.getCropData());
            return true;
        }.bind(this));
    }


    this.form.on('afterSubmit', function(dataLayer) {
        this.loadDataLayer(dataLayer);
        this.events.afterSubmit(this);
    }.bind(this));
};

Planck.Extension.Content.Module.Image.View.Component.ImageDetail.prototype.getCropData = function()
{
    return this.cropper.getData();
};



Planck.inherit(
    Planck.Extension.Content.Module.Image .View.Component.ImageDetail,
    Planck.Extension.ViewComponent.Component
);
