Planck.Extension.Content.Module.Article.Controller.Edit.Features.Tag = function(editor)
{
    this.services = {
        tag: {
            save: {
                url:'?/content/article/api/save-tags',
                method: 'post'
            }
        }
    };

    this.editor = editor;
    this.article = this.editor.getArticle();
};


Planck.Extension.Content.Module.Article.Controller.Edit.Features.Tag.prototype.initialize = function()
{

    var component = new Planck.Extension.ViewComponent.Component();

    var loader = component.getRemoteCallInstance('Planck\\Extension\\RichTag\\View\\Component\\EntityTagInput');
    loader.addMethodCall('loadEntityById', [
            'Planck\\Extension\\Content\\Model\\Entity\\Article',
            this.article.getValue('id')
        ]
    );

    loader.load(function(response) {

        var tagInputElement = $(response.html);

        this.$element = this.getContainer('Tags', 'tag_input_container');
        this.$element.find('.tag_input_container').append(tagInputElement);

        this.$tagManager = new Planck.Extension.FormComponent.View.Component.TagInput(tagInputElement);
        this.$tagManager.initialize();

        this.$tagManager.on('change', function(tagManager) {
            this.updateTags(tagManager);
        }.bind(this));

        this.register('tag');

    }.bind(this));
};


Planck.Extension.Content.Module.Article.Controller.Edit.Features.Tag.prototype.updateTags = function()
{
    if(!this.article.getValue('id')) {
        return false;
    }
    var data = {
        article: this.article.getValues(),
        tags: this.$tagManager.getValues()
    };

    Planck.ajax({
        url: this.services.tag.save.url,
        method: this.services.tag.save.method,
        data: data,
        success: function(reponse) {

        }.bind(this)
    });
};


Planck.inherit(
    Planck.Extension.Content.Module.Article.Controller.Edit.Features.Tag,
    Planck.Extension.Content.Module.Article.Controller.Edit.Feature
);
















