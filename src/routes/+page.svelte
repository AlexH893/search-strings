<script>
	import { Button, Input, Label, Select } from 'flowbite-svelte';

	let searchString = '';
	let showToast = false;

	let filters = {
		shiny: null,
		legendary: null,
		event: null,
		mythical: null,
		lucky: null,
		costume: null,
		shadow: null,
		favorite: null,
		defender: null,
		eggsonly: null,
		evolvenew: null,
		megaevolve: null,
		hatched: null,
		item: null
	};

	const filterDescriptions = {
		shiny: 'Returns all shiny Pokémon',
		legendary: 'Filters for legendary Pokémon',
		event: 'Includes Pokémon obtained during events',
		mythical: 'Filters for mythical Pokémon',
		lucky: 'Returns lucky Pokémon from trades',
		costume: 'Shows Pokémon with costumes',
		shadow: 'Includes shadow Pokémon',
		favorite: 'Filters for Pokémon marked as favorites',
		defender: 'Shows Pokémon currently defending gyms',
		eggsonly: 'Returns list of all Baby Pokémon',
		evolvenew: 'Returns list of all Pokémon that once evolved, will be new Pokedex entries',
		megaevolve: 'Returns all Pokemon that can be mega evolved',
		hatched: 'Returns all hatched Pokemon',
		item: 'Returns list of all Pokémon that can be evolved with an item'
	};

	let selectedRegion = '';
	let regionMode = null;

	const regions = ['kanto', 'johto', 'hoenn', 'sinnoh', 'unova', 'alola', 'galar'];

	function updateSearchString() {
		const parts = [];

		for (const key in filters) {
			if (filters[key] === 'include') parts.push(key);
			else if (filters[key] === 'exclude') parts.push('!' + key);
		}

		if (selectedRegion && regionMode) {
			parts.push(regionMode === 'include' ? selectedRegion : '!' + selectedRegion);
		}

		searchString = parts.join('&');
	}

	function setFilter(key, mode) {
		filters[key] = filters[key] === mode ? null : mode;
		updateSearchString();
	}

	function setTypeMode(mode) {
		regionMode = regionMode === mode ? null : mode;
		updateSearchString();
	}

	function handleTypeChange(e) {
		selectedRegion = e.target.value;
		updateSearchString();
	}

	function resetFilters() {
		searchString = '';
		for (const key in filters) {
			filters[key] = null;
		}
		selectedRegion = '';
		regionMode = null;
	}

	async function copyToClipboard() {
		try {
			await navigator.clipboard.writeText(searchString);
			showToast = true;
			setTimeout(() => (showToast = false), 1500);
		} catch (err) {
			alert('Failed to copy');
			console.error(err);
		}
	}
</script>

<!-- Page Layout -->
<div class="mx-auto max-w-7xl px-4 py-6">
	<h1 class="mt-1 mb-6 text-center text-2xl font-bold">Pokémon GO Search Builder</h1>

	<div class="flex flex-col gap-8 md:flex-row">
		<!-- Left: Filters -->
		<div class="max-h-[80vh] w-full overflow-y-auto pr-2 md:max-h-none md:w-[700px]">
			<div class="space-y-6">
				{#each Object.keys(filters) as filterKey}
					<div>
						<Label class="mb-1 block font-semibold capitalize">{filterKey}</Label>
						<p class="mb-2 text-sm text-gray-500">{filterDescriptions[filterKey]}</p>

						<div class="flex gap-4">
							<label class="flex cursor-pointer items-center gap-2">
								<input
									type="checkbox"
									checked={filters[filterKey] === 'include'}
									on:change={() => setFilter(filterKey, 'include')}
								/>
								<span>Include</span>
							</label>
							<label class="flex cursor-pointer items-center gap-2">
								<input
									type="checkbox"
									checked={filters[filterKey] === 'exclude'}
									on:change={() => setFilter(filterKey, 'exclude')}
								/>
								<span>Exclude</span>
							</label>
						</div>
					</div>
				{/each}

				<!-- Region Dropdown -->
				<div>
					<Label class="mb-2 block font-semibold">Region</Label>

					<div class="flex flex-wrap items-center gap-4">
						<Select on:change={handleTypeChange} value={selectedRegion} class="w-40">
							<option value="">Select Region</option>
							{#each regions as region}
								<option value={region}>{region}</option>
							{/each}
						</Select>

						<label class="flex items-center gap-2">
							<input
								type="checkbox"
								checked={regionMode === 'include'}
								on:change={() => setTypeMode('include')}
							/>
							<span>Include</span>
						</label>
						<label class="flex items-center gap-2">
							<input
								type="checkbox"
								checked={regionMode === 'exclude'}
								on:change={() => setTypeMode('exclude')}
							/>
							<span>Exclude</span>
						</label>
					</div>
				</div>
			</div>
		</div>

		<!-- Right: Controls -->
		<div
			class="fixed bottom-0 left-0 z-50 w-full space-y-4 border-t bg-white p-4 shadow md:sticky md:top-8 md:w-80 md:border-none md:bg-transparent md:shadow-none"
		>
			<h2 class="text-lg font-semibold">Search Output</h2>

			<div class="space-y-2">
				<Input bind:value={searchString} readonly />
				<div class="flex gap-2">
					<Button color="gray" onclick={resetFilters}>Reset</Button>
					<Button onclick={copyToClipboard}>Copy</Button>
				</div>
			</div>

			{#if showToast}
				<div class="rounded bg-green-500 px-4 py-2 text-white shadow-lg">Copied to clipboard!</div>
			{/if}
		</div>
	</div>
</div>
