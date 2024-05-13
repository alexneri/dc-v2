
import { src, dest, watch, series, parallel } from 'gulp';
import sass from 'gulp-sass';
import dartSass from 'sass';
import rename from 'gulp-rename';
import del from 'del';
import browserSync from 'browser-sync';

const sassProcessor = sass(dartSass);

// Sass Task
function sassTask() {
    return src('src/**/*.scss')
        .pipe(sassProcessor().on('error', sassProcessor.logError))
        .pipe(rename({ suffix: '.min' }))
        .pipe(dest('dist/css'))
        .pipe(browserSync.stream());
}

// Clean Task
async function clean() {
    await del(['dist/**/*']);
}

// Watch Task
function watchTask() {
    browserSync.init({
        server: {
            baseDir: './dist'
        }
    });
    watch(['src/**/*.scss', 'src/**/*.js', 'src/**/*.html'], series(clean, parallel(sassTask), reload));
    watch('src/**/*.html').on('change', browserSync.reload);
}

// BrowserSync Reload
function reload(done) {
  browserSync.reload();
  done();
}

// Default Gulp task
export default series(
    clean,
    parallel(sassTask),
    watchTask
);
