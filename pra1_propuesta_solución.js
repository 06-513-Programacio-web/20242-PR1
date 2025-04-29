// Clase Film representa una película con sus propiedades y métodos de acceso
class Film {
    constructor(id, title, overview, popularity, poster_path, release_date, vote_average, vote_count, genre_ids) {
        //Marcamos las propiedades como privadas
        this._id = id;
        this._title = title;
        this._overview = overview;
        this._popularity = popularity;
        this._poster_path = poster_path;
        this._release_date = release_date;
        this._vote_average = vote_average;
        this._vote_count = vote_count;
        this._genre_ids = Array.isArray(genre_ids) ? genre_ids : [];
    }

    //Utilizamos getters y setters para acceder a las propiedades privadas
    // Getter y setter para cada propiedad
    get id() { return this._id; }
    set id(value) { this._id = value; }

    get title() { return this._title; }
    set title(value) { this._title = value; }

    get overview() { return this._overview; }
    set overview(value) { this._overview = value; }

    get popularity() { return this._popularity; }
    set popularity(value) { this._popularity = value; }

    get poster_path() { return this._poster_path; }
    set poster_path(value) { this._poster_path = value; }

    get release_date() { return this._release_date; }
    set release_date(value) { this._release_date = value; }

    get vote_average() { return this._vote_average; }
    set vote_average(value) { this._vote_average = value; }

    get vote_count() { return this._vote_count; }
    set vote_count(value) { this._vote_count = value; }

    get genre_ids() { return this._genre_ids; }
    set genre_ids(value) { this._genre_ids = Array.isArray(value) ? value : []; }
}

// Clase FilmList representa una colección de películas
class FilmList {
    constructor() {
        this.films = [];
    }

    addFilm = (film) => {
        // Validar que film sea una instancia de Film
        if (!(film instanceof Film)) {
            console.log("El parámetro debe ser una instancia de Film.");
        }
    
        // Verificar que la película no exista ya en la lista (por ID)
        if (this.films.some(f => f.id === film.id)) {
            console.log(`La película "${film.title}" ya está en la lista.`);
            return;
        }
    
        // Agregar la película a la lista
        this.films.push(film);
        console.log(`Película "${film.title}" añadida correctamente.`);
    };
    

    removeFilm = (filmId) => {
        this.films = this.films.filter(film => film.id !== filmId);
    }

    showList = () => {
        this.films.forEach(film => console.log(`${film.id} ${film.title} (${film.release_date}) - ${film.vote_average}`));
    }

    addMultipleFilms = (...films) => {
        films.forEach(film => {
            // Validar que film sea una instancia de Film
            if (!(film instanceof Film)) {
                console.log("El parámetro debe ser una instancia de Film.");
            }
    
            // Verificar que la película no exista ya en la lista (por ID)
            if (this.films.some(f => f.id === film.id)) {
                console.log(`La película "${film.title}" ya está en la lista.`);
                return; // Salir del bucle para esta película
            }
    
            // Agregar la película a la lista
            this.films.push(film);
            console.log(`Película "${film.title}" añadida correctamente.`);
        });
    }
    

    getFilmsByDateRange = (startDate, endDate) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
    
        // Verificar que las fechas sean válidas
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            console.log("Las fechas proporcionadas no son válidas.");
        }
    
        // Verificar que la fecha de inicio sea menor o igual a la de fin
        if (start > end) {
            console.log("La fecha de inicio no puede ser mayor que la fecha de fin.");
        }
    
        const filteredFilms = this.films
            .filter(film => {
                const releaseDate = new Date(film.release_date);
                return releaseDate >= start && releaseDate <= end;
            })
            .map(film => `${film.title} (${film.release_date})`);
    
        // Devolver un mensaje si no hay películas en el rango
        return filteredFilms.length > 0 ? filteredFilms : ["No hay películas en este rango de fechas."];
    }

    sortFilmsByPopularity = () => {
        if (this.films.length === 0) {
            return ["No hay películas en la lista."];
        }
    
        return [...this.films]
            .sort((a, b) => b.popularity - a.popularity)
            .map(film => `${film.title} - Popularidad: ${film.popularity}`);
    }
    

    findFilmById(filmId, index = 0) {
        // Validar que filmId sea un número válido
        if (typeof filmId !== "number" || isNaN(filmId)) {
            console.log("El parámetro filmId debe ser un número válido.");
            return null;
        }

        // Verificar si la lista está vacía
        if (this.films.length === 0) {
            console.log("La lista de películas está vacía.");
            return null;
        }

        // Si el índice supera el tamaño de la lista, significa que no se ha encontrado la película
        if (index >= this.films.length) {
            console.log(`La película con ID ${filmId} no se ha encontrado.`);
            return null;
        }

        if (this.films[index].id === filmId) return this.films[index];

        return this.findFilmById(filmId, index + 1);
    }

    getMostCommonGenre() {
        const genreCount = this.films.reduce((acc, film) => {
            film.genre_ids.forEach(genre => {
                acc[genre] = (acc[genre] || 0) + 1; // Objeto para contar géneros
                // Si el género no existe, inicializarlo en 0 y luego incrementar
            });
            return acc;
        }, {});
        // Recorre los IDs y encuentra el que tiene el valor más alto en genreCount (es decir, el que más veces aparece).
        // Devuelbe el Id como resultado
        return Object.keys(genreCount).reduce((a, b) => genreCount[a] > genreCount[b] ? a : b, null);
    }

    getPopularFilmTitles(minVote) {
        // Validar que minVote sea un número
        if (typeof minVote !== "number" || isNaN(minVote)) {
            console.log("El parámetro minVote debe ser un número válido.");
            return [];
        }

        // Validar que minVote esté entre 0 y 10
        if (minVote < 0 || minVote > 10) {
            console.log("El parámetro minVote debe estar entre 0 y 10.");
            return [];
        }

        // Verificar si la lista está vacía
        if (this.films.length === 0) {
            console.log("La lista de películas está vacía.");
            return [];
        }

        // Filtrar películas con una votación igual o superior a minVote y devolver títulos
        const filteredFilms = this.films
            .filter(film => film.vote_average >= minVote)
            .map(film => `${film.title} (${film.vote_average})`);

        // Verificar si hay películas que cumplen el criterio
        if (filteredFilms.length === 0) {
            console.log(`No hay películas con una votación de al menos ${minVote}.`);
        }

        return filteredFilms;
    }
}



// Código de prueba
console.log("\n");
console.log("\n");
console.log("************* ETAPA 1 *************");

const film1 = new Film(1, "Inception", "A mind-bending thriller", 8.8, "poster1.jpg", "2010-07-16", 8.8, 20000, [28, 878]);
const film2 = new Film(2, "Interstellar", "A journey beyond the stars", 9.0, "poster2.jpg", "2014-11-07", 9.0, 25000, [12, 878]);
const film3 = new Film(3, "The Dark Knight", "Batman fights Joker", 9.1, "poster3.jpg", "2008-07-18", 9.1, 30000, [28, 80]);
const film4 = new Film(4, "Fight Club", "An underground fight club", 8.9, "poster4.jpg", "1999-10-15", 8.9, 18000, [18]);
const film5 = new Film(5, "Pulp Fiction", "Multiple intertwined stories", 9.0, "poster5.jpg", "1994-10-14", 9.0, 22000, [80, 53]);
const film6 = new Film(6, "The Matrix", "Reality is an illusion", 8.7, "poster6.jpg", "1999-03-31", 8.7, 21000, [28, 878]);
const film7 = new Film(7, "Forrest Gump", "A man's extraordinary life", 8.8, "poster7.jpg", "1994-07-06", 8.8, 24000, [18, 35]);
const film8 = new Film(8, "The Godfather", "The rise of a mafia family", 9.2, "poster8.jpg", "1972-03-24", 9.2, 28000, [80, 18]);
const film9 = new Film(9, "Schindler's List", "A story of survival", 9.0, "poster9.jpg", "1993-11-30", 9.0, 15000, [18, 36]);
const film10 = new Film(10, "The Shawshank Redemption", "Hope and perseverance", 9.3, "poster10.jpg", "1994-09-23", 9.3, 26000, [18]);
const film11 = new Film(11, "The Avengers", "Superheroes unite", 8.5, "poster11.jpg", "2012-05-04", 8.5, 19000, [28, 12]);
const film12 = new Film(12, "Titanic", "A tragic love story", 7.8, "poster12.jpg", "1997-12-19", 7.8, 27000, [18, 10749]);
const film13 = new Film(13, "Avatar", "A new world explored", 8.0, "poster13.jpg", "2009-12-18", 8.0, 29000, [878, 12]);
const film14 = new Film(14, "Gladiator", "A fight for freedom", 8.6, "poster14.jpg", "2000-05-05", 8.6, 23000, [28, 36]);

/* ETAPA 2*/
console.log("\n");
console.log("************* ETAPA 2 *************");
const myFilmList = new FilmList();
const films = [film1, film2, film3, film4, film5, film6, film7, film8, film9, film10, film11, film12, film13, film14];
const myNewFilm = new Film(15, "The Lion King", "A young lion's journey", 8.5, "poster15.jpg", "1994-06-24", 8.5, 22000, [16, 10751])


console.log("Agregando de manera múltiple:");
myFilmList.addMultipleFilms(...films);

console.log("\n");
console.log("Agregando a la lista la película con ID 15:");
myFilmList.addFilm(myNewFilm);

console.log("\n");
console.log("Agregando a la lista la película con ID 11:");
myFilmList.addFilm(film11);

console.log("\n");
console.log("Eliminando película con ID 15:");
myFilmList.removeFilm(15);

console.log("\n");
console.log("Lista de películas:");
myFilmList.showList();


/*ETAPA 3*/
console.log("\n");
console.log("************* ETAPA 3 *************");

console.log("\n");
console.log("Películas entre 1995 y 2010:");
console.log(myFilmList.getFilmsByDateRange("1995-01-01", "2010-12-31"));

console.log("\n");
console.log("Películas entre 1995 y 1810:");
console.log(myFilmList.getFilmsByDateRange("1995-01-01", "1810-12-31"));

console.log("\n");
console.log("Películas ordenadas por popularidad:");
console.log(myFilmList.sortFilmsByPopularity());



/*ETAPA 4*/
console.log("\n");
console.log("************* ETAPA 4 *************");
console.log("Película con ID 2:");
console.log(myFilmList.findFilmById(2));

/*ETAPA 5*/
console.log("\n");
console.log("************* ETAPA 5 *************");
console.log("Género más común:");
console.log(myFilmList.getMostCommonGenre());

/*ETAPA 6*/
console.log("\n");
console.log("************* ETAPA 6 *************");
console.log("Películas con voto mayor a 8.5:");
console.log(myFilmList.getPopularFilmTitles(8.5));












/* OTRAS OPCIONES PARA EL FUTURO*/

/*const groupFilmsByGenre = (filmList) => {
    // Validar que filmList sea una instancia de FilmList
    if (!(filmList instanceof FilmList)) {
        console.log("El parámetro debe ser una instancia de FilmList.");
        return null;
    }

    return filmList.films.reduce((acc, film) => {
        film.genre_ids.forEach(genre => {
            if (!acc[genre]) {
                acc[genre] = []; // Inicializar un array para el género si no existe
            }
            acc[genre].push(film); // Agregar la película al género correspondiente
        });
        return acc;
    }, {});
};

const countFilmsByGenre = (filmList) => {
    const genreCount = {};

    filmList.films.forEach(film => {
        film.genre_ids.forEach(genre => {
            if (!genreCount[genre]) {
                genreCount[genre] = 0; // Inicializar conteo en 0 si no existe
            }
            genreCount[genre]++; // Incrementar el conteo
        });
    });

    return genreCount;
};


const groupedFilms = groupFilmsByGenre(myFilmList);
console.log(groupedFilms);

const genreCount = countFilmsByGenre(myFilmList);
console.log(genreCount);*/