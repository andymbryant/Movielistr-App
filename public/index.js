$(function() {
    $(".list-card-click").on("click",function(e) {
        var form = $(this).closest("form");
        form.submit();
    });

    $(document).on('click', '.delete', function() {
        let listID = $('.list-id').val();
        let id = $(this).data('value');
        let data = {"movieID": id, "listID": listID};

        $.ajax({
            type: "POST",
            url: 'remove/movie',
            data: data,
            dataType: 'json',
            success: console.log('The ajax call posted')
        });

        $(this).closest('li').remove();
    });

    $(document).on('click', '.remove-list', function(e) {
        e.preventDefault();
        let listID = $(this).data('value');
        let data = {"listID": listID};

        $.ajax({
            type: "POST",
            url: 'remove/list',
            data: data,
            dataType: 'json',
            success: console.log('The ajax call posted')
        });

        $(this).closest('li').remove();
      });

    $('.list-title').on('change', function(e) {
        e.preventDefault();
        let listID = $('.list-id').val();
        let newTitle = $('.list-title').val();
        let data = {"listID": listID, "newTitle": newTitle}
        $.ajax({
            type: "POST",
            url: 'lists/update-title',
            data: data,
            dataType: 'json',
            success: console.log('The title was updated')
        });
    })
});

    $('#input-form').on('submit', function (e) {
        e.preventDefault();
        const listID = $('.list-id').val();
        const movieString = $('[name=imdb-url]').val();
        const id = movieString.substring(26, 35);
        const apiKey = '&apikey=36a0bcd3';
        const baseUrl = 'https://www.omdbapi.com/?i=';
        const finalUrl = baseUrl + id + apiKey;

        $.ajax({
            type: "GET",
            url: finalUrl,
            dataType: 'json',
            success: (data) => {
                $.ajax({
                    type: "POST",
                    url: 'lists/new-movie',
                    data: {data:data, listID:listID},
                    dataType: 'json',
                    success: console.log('This worked abcdef')
                });

            $('#movies').append(
                `<li>
                <div class="card">
                    <span class="helper"></span><img class="poster" src="${data.Poster}" alt="">
                        <h1 class="movie-title">${data.Title}</h1>
                        <ul class="tech-info">
                            <li>${data.Rated} •</li>
                            <li>${data.Year} •</li>
                            <li>${data.Runtime}</li>
                        </ul>
                    <div class="reviews">
                        <img class="tomatoes" src="http://www.abryant.co/movie_images/tomato.png" alt=""><span>${data.Ratings[1].Value}</span>
                        <img class="imdb" src="http://www.abryant.co/movie_images/star.png" alt=""><span>${data.Ratings[0].Value}</span>
                    </div>
                    <div class="plot">
                        <p>${data.Plot}</p>
                    </div>
                    <div class="actors">
                        <p>${data.Actors}</p>
                    </div>
                    <div class="director">
                        <p><span class="director-label">Director:</span> ${data.Director}</p>
                    </div>
                    <span class="svg-color delete" data-value="${data.imdbID}"><svg class="svg" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm4.151 17.943l-4.143-4.102-4.117 4.159-1.833-1.833 4.104-4.157-4.162-4.119 1.833-1.833 4.155 4.102 4.106-4.16 1.849 1.849-4.1 4.141 4.157 4.104-1.849 1.849z"/></svg></span>
                </div>
                </li>`
                );
            }
        });

            $('.add-movie').val('');
        });

    $('.new-list-form').on('submit', function(e) {
        e.preventDefault();

        $.ajax({
            type: "GET",
            url: 'lists/new-list',
            success: (data) => {
                $('#list-of-lists').append(
                    `<li>
                        <div class="list-card">
                            <h1 class="list-card-title">New List</h1>
                            <form action="/lists" method="post">
                                <input class="none" type="text" name="listID" value="${data}">
                                <button class="edit-list" type="submit" value="hello">View/Edit</button>
                            </form>
                            <form action="/lists/remove" method="post">
                                <input class="none" type="text" name="listID" value="${data}">
                                <button class="remove-list" type="submit" value="hello">Delete</button>
                            </form>
                        </div>
                    </li>`
                )
            }
        });
    })

$('#exit-list').on('submit', function(e) {
    e.preventDefault();
    window.location.replace('/');
});

$('.logout-form').on('submit', function(e) {
    e.preventDefault();

    $.ajax({
        type: "GET",
        url: 'users/logout',
        success: data => {
            window.location = data
        }
  })
})
