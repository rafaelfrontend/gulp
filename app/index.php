<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Gulp</title>
    <!-- build:js vendor.min.css -->
    <!-- bower:css -->
    <!-- endinject -->
    <!-- /build -->

    <!-- inject:css -->
    <!-- endinject -->

</head>
<body>

    <h1>Teste</h1>



    <!-- build:js vendor.min.js -->
    <!-- bower:js -->
    <script src="<?php echo $build ?>/../bower_components/greensock/src/uncompressed/TweenMax.js"></script>
    <!-- endinject -->
    <!-- /build -->
    <!-- build:js script.min.js -->
    <!-- inject:js -->
    <script src="<?php echo $build ?>/../app/js/main.js"></script>
    <script src="<?php echo $build ?>/../app/js/vendor/vendor.js"></script>
    <script src="<?php echo $build ?>/../app/js/vendor/vendor2.js"></script>
    <!-- endinject -->
    <!-- /build -->

</body>
</html>
