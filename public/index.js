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
        url: 'http://localhost:3000/remove/movie',
        data: data,
        dataType: 'json',
        success: console.log('The ajax call posted')
      })
      $(this).closest('li').remove();
    });


  $('.list-title').on('change', function(e) {
    let listID = $('.list-id').val();
    e.preventDefault();
    let newTitle = $('.list-title').val();
    let data = {"listID": listID, "newTitle": newTitle}
    $.ajax({
      type: "POST",
      url: 'http://localhost:3000/lists/update-title',
      data: data,
      dataType: 'json',
      success: console.log('The title was updated')
    });
  })
  });


  $('#input-form').on('submit', function (e) {
          e.preventDefault();

          const movieString = $('[name=imdb-url]').val();
          const id = movieString.substring(26, 35);
          const apiKey = '&apikey=36a0bcd3';
          const baseUrl = 'http://www.omdbapi.com/?i=';
          const finalUrl = baseUrl + id + apiKey;
          console.log(finalUrl);

          $.ajax({
            type: "GET",
            url: finalUrl,
            dataType: 'json',
            success: (data) => {
              $.ajax({
                type: "POST",
                url: 'http://localhost:3000/lists/new-movie',
                data: data,
                dataType: 'json',
                success: console.log(data)
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
                    <img class="delete" src="/images/delete.png" data-value="${data.imdbID}">
                  </div>
                </li>`
              );
            }
          });
        });
