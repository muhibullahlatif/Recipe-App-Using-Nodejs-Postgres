$(document).ready(function(){
    $('.delete-recipe').on('click', function(){
        var Id = $(this).data('id');
        var Url = '/delete/' + Id;

        console.log(Id);

        if(confirm('Delete Recipe ?')){
            $.ajax({
                url: Url,
                type: 'DELETE',
                success: function(result){
                    console.log('Deleting Recipe ...');
                    window.location.href = '/';
                },
                error: function(err){
                    console.log(err);
                }
            });
        }
    });
    $('.edit-recipe').on('click', function(){
        $('#edit_recipe_name').val($(this).data('name'));
        $('#edit_recipe_ingredients').val($(this).data('ingredients'));
        $('#edit_recipe_directions').val($(this).data('directions'));
        $('#edit_form_id').val($(this).data('id'));

        console.log(name);
    });
});
