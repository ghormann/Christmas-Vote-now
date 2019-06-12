<template>
    <div>
        <h2>Current Queue</h2>
        <div class="songs">
            <div v-for="song in allSongs" v-bind:key="song.id" class="song">
                {{song.title}}

            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    name: "SongList",
    computed: mapGetters(['allSongs'])
}
</script>

<style>

</style>
