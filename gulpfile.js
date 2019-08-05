var plumber = require("gulp-plumber");
var rename = require("gulp-rename");
var sass = require("gulp-sass");
var autoPrefixer = require("gulp-autoprefixer");
//if node version is lower than v.0.1.2
require("es6-promise").polyfill();
var cssComb = require("gulp-csscomb");
var cmq = require("gulp-merge-media-queries");
var cleanCss = require("gulp-clean-css");
var uglify = require("gulp-uglify");
var pug = require("gulp-pug");
var gulp = require("gulp"),
  browserSync = require("browser-sync").create(),
  reload = browserSync.reload;

var imagemin = require("gulp-imagemin");

gulp.task("scss", function() {
  return gulp
    .src("src/scss/**/*.scss")
    .pipe(
      plumber({
        handleError: function(err) {
          console.log(err);
          this.emit("end");
        }
      })
    )
    .pipe(sass())
    .pipe(autoPrefixer())
    .pipe(cssComb())
    .pipe(cmq({ log: true }))
    .pipe(gulp.dest("dist/css"))
    .pipe(
      rename({
        suffix: ".min"
      })
    )
    .pipe(cleanCss())
    .pipe(gulp.dest("dist/css"));
});

gulp.task("image", function() {
  return gulp
    .src("src/img/*")
    .pipe(imagemin())
    .pipe(gulp.dest("dist/img"));
});

gulp.task("js", function() {
  return gulp
    .src(["src/js/**/*.js"])
    .pipe(
      plumber({
        handleError: function(err) {
          console.log(err);
          this.emit("end");
        }
      })
    )
    .pipe(gulp.dest("dist/js"))
    .pipe(
      rename({
        suffix: ".min"
      })
    )
    .pipe(uglify())
    .pipe(gulp.dest("dist/js"));
});
gulp.task("html", function() {
  return gulp
    .src(["*.html"])
    .pipe(
      plumber({
        handleError: function(err) {
          console.log(err);
          this.emit("end");
        }
      })
    )
    .pipe(gulp.dest("."));
});

gulp.task("pug", function() {
  return gulp
    .src("src/**/*.pug")
    .pipe(
      plumber({
        handleError: function(err) {
          console.log(err);
          this.emit("end");
        }
      })
    )
    .pipe(
      pug({
        doctype: "html",
        pretty: true
      })
    )
    .pipe(gulp.dest("dist"));
});

gulp.task("serve", function() {
  // Serve files from the root of this project
  browserSync.init({
    server: {
      baseDir: "./dist/pages"
    }
  });

  gulp.watch("src/js/**/*.js", gulp.series("js")).on("change", reload);
  gulp.watch("src/scss/**/*.scss", gulp.series("scss")).on("change", reload);
  gulp.watch("src/img/*", gulp.series("image")).on("change", reload);
  // gulp.watch("*.html", gulp.series("html")).on("change", reload);
  gulp.watch("src/**/*.pug", gulp.series("pug")).on("change", reload);
});
