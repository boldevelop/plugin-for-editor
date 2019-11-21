const gulp = require('gulp');
const connect = require('gulp-connect');

const PATH = {
    root: './www',
};

gulp.task('server', (callback) => {
    connect.server({
        root: PATH.root,
        port: 8888,
    });
    callback();
});
