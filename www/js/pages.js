document.addEventListener("deviceready", initPages, false);

function initPages() {
    $('[data-role="page"]:not(#main)').hide();

    let $all_pages = $('[data-role="page"]');

    $all_pages.each((index, element) => {
        let id = element.id;
        let $element = $(element);

        $(`[href="#${id}"`).on('click', () => {
            $all_pages.hide();
            $element.show();

            $(document).trigger('page-show.' + id);

            return false;
        });
    });
}