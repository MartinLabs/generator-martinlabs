import Vue from 'vue';

Vue.filter('truncate', function (string, value) {
    if (string && string.length > value) {
        return string.substring(0, value) + '...';
    } else {
        return string;
    }
});