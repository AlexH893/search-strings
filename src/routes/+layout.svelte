<script lang="ts">
	export const prerender = true;

	import '../app.css';

	let { children, data } = $props();
</script>

{@render children()}
