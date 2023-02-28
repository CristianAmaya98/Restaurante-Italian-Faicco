const { src, dest, series, parallel, watch } = require('gulp');


// CSS y SASS
const sass = require("gulp-sass")(require("sass"));
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const sourcemaps = require("gulp-sourcemaps");
const cssnano = require("cssnano");
const rename = require('gulp-rename');

// IMAGENES
const imagemin = require("gulp-imagemin");

// HTML
const htmlmin = require('gulp-htmlmin');


// WEB SERVER
const connect = require('gulp-connect');


const config = {
    sass: {
        input: 'src/scss/app.scss',
        ouput: 'dist/css',
        watchAndReload: 'src/scss/**/*.scss',
        production: false
    },
    html: {
        input: 'src/index.html',
        ouput: 'dist',
        watchAndReload: 'src/index.html',
        production: false
    },
    assets: {
        input: 'src/assets/**/*',
        watchAndReload: 'src/assets/**/*',
        ouput: 'dist/assets'
    },
    server: {
        name: 'Restaurant Italian',
        root: 'dist',
        port: 3070
    }
}



const compilarSass = () => {
    return src(config.sass.input)
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: (config.sass.production)? 'compressed': 'expanded'
        }).on('error', sass.logError)
        )
        .pipe(postcss([
            autoprefixer(),
            cssnano()
        ]))
        .pipe(rename({ extname: '.min.css' }))
        .pipe(sourcemaps.write("."))
        .pipe(dest(config.sass.ouput))
        .pipe(connect.reload())
}

const compilarHtml = () => {
    return src(config.html.input)
        .pipe(
            htmlmin({
                collapseWhitespace: config.html.production,
                removeComments: config.html.production
            })
        )
        .pipe(dest(config.html.ouput))
        .pipe(connect.reload())
}


const assetsOptimization = () => {
    return src(config.assets.input)
        .pipe(
            imagemin({
                optimizationLevel: 3
            })
        )
        .pipe(dest(config.assets.ouput))
}


const connectLiveReload = () => {
    connect.server({
        name: config.server.name,
        root: config.server.root,
        livereload: true,
        port: config.server.port
    })
}


const watchAndReload = () => {
    watch(config.html.watchAndReload, compilarHtml);
    watch(config.sass.watchAndReload, compilarSass);
    watch(config.assets.watchAndReload, assetsOptimization);
}



exports.build = series(assetsOptimization, compilarHtml, compilarSass);
exports.default = series(assetsOptimization, compilarHtml, compilarSass, parallel(watchAndReload, connectLiveReload));