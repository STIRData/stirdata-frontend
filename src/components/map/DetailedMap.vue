<template>
  <div id="detailedMap" />
</template>

<script>
  export default {
    name: 'DetailedMap',

    async beforeRouteLeave(to, from, next) {
      await this.mapChart.dispose();
      next();
    },

    data() {
      return {
        countrySeries: [],
        countryTemplate: null,
        selectedCountry: null,
        regionSeries: [],
        regionTemplate: null,
        // selectedRegion: null,
        previousLevel: '',
        colorShades: ['#aaaed5', '#6b72b5', '#2b3595'],
        countries: [
          { id: 'BE', name: 'Belgium',        fill: '#aaaed5', hasInfo: true },
          { id: 'UK', name: 'United Kingdom', fill: '#aaaed5', hasInfo: true },
          { id: 'CZ', name: 'Czechia',        fill: '#aaaed5', hasInfo: true },
          { id: 'GR', name: 'Greece',         fill: '#aaaed5', hasInfo: true },
          { id: 'CY', name: 'Cyprus',         fill: '#aaaed5', hasInfo: true },
          { id: 'FI', name: 'Finland',        fill: '#aaaed5', hasInfo: true },
          { id: 'EE', name: 'Estonia',        fill: '#aaaed5', hasInfo: true },
          { id: 'LV', name: 'Latvia',         fill: '#aaaed5', hasInfo: true },
          { id: 'NO', name: 'Norway',         fill: '#aaaed5', hasInfo: true },
          { id: 'RO', name: 'Romania',        fill: '#aaaed5', hasInfo: true }
        ]
      };
    },

    mounted() {
      this.am4core = this.$am4core().am4core;
      this.am4maps = this.$am4core().am4maps;
      this.europeHigh = this.$am4core().europeHigh;

      this.initializeMap();
    },

    methods: {
      initializeMap() {
        // Create map instance
        this.mapChart = this.am4core.create('detailedMap', this.am4maps.MapChart);

        let chart = this.mapChart;
        chart.geodata = this.europeHigh;                          // Set map definition
        chart.projection = new this.am4maps.projections.Miller(); // Set projection
        chart.panBehavior = 'none';                               // Disable map panning

        // Configure home button
        let homeButton = new this.am4core.Button();
        homeButton.icon = new this.am4core.Sprite();
        homeButton.icon.path = 'M16,8 L14,8 L14,16 L10,16 L10,10 L6,10 L6,16 L2,16 L2,8 L0,8 L8,0 L16,8 Z M16,8';
        homeButton.background.fill = this.am4core.color('#2b3595');
        homeButton.fill = this.am4core.color('#FFF');
        homeButton.padding(7, 5, 23, 5);
        homeButton.height = 30;
        homeButton.width = 30;
        homeButton.dx = 12;
        homeButton.dy = 12;
        homeButton.tooltip = new this.am4core.Tooltip();
        homeButton.tooltip.pointerOrientation = 'left';
        homeButton.tooltip.dx = 16;
        homeButton.tooltip.dy = 8;
        homeButton.tooltipText = 'Return to Europe';
        homeButton.tooltipColorSource = this.am4core.color('#2b3595');
        homeButton.parent = chart;

        // Configure back Button
        let backButton = new this.am4core.Button();
        backButton.icon = new this.am4core.Sprite();
        backButton.icon.path = 'M 0.625 12.5 L 10 3.75 L 19.375 12.5 L 16.875 15 L 10 8.75 L 3.125 15 Z M 0.625 12.5';
        backButton.background.fill = this.am4core.color('#2b3595');
        backButton.fill = this.am4core.color('#FFF');
        backButton.padding(9, 6, 20, 6);
        backButton.height = 30;
        backButton.width = 30;
        backButton.dx = 12;
        backButton.dy = 48;
        backButton.tooltip = new this.am4core.Tooltip();
        backButton.tooltip.pointerOrientation = 'left';
        backButton.tooltip.dx = 16;
        backButton.tooltip.dy = 6;
        backButton.tooltipText = 'Go to previous level';
        backButton.tooltipColorSource = this.am4core.color('#2b3595');
        backButton.parent = chart;

        // Create country series
        this.countrySeries = chart.series.push(new this.am4maps.MapPolygonSeries());
        this.countrySeries.useGeodata = true;     // Make map load polygon (like country names) data from GeoJSON
        this.countrySeries.data = this.countries; // Load countries data
        // Configure polygon template
        this.countryTemplate = this.countrySeries.mapPolygons.template;
        this.countryTemplate.propertyFields.fill = 'fill';
        this.countryTemplate.tooltipText = '{name}';
        this.countryTemplate.fill = this.am4core.color('#c1c1c1');
        // Create hover state and set alternative fill color
        var hs = this.countryTemplate.states.create('hover');
        hs.properties.fill = this.am4core.color(this.colorShades[2]);

        // Create region series
        this.regionSeries = chart.series.push(new this.am4maps.MapPolygonSeries());
        this.regionSeries.useGeodata = true;
        this.regionSeries.hide();
        // Configure polygon template
        this.regionTemplate = this.regionSeries.mapPolygons.template;
        this.regionTemplate.propertyFields.fill = 'fill';
        this.regionTemplate.tooltipText = '{name}';
        this.regionTemplate.fill = this.am4core.color(this.colorShades[1]);
        // Create hover state and set alternative fill color
        var hs = this.regionTemplate.states.create('hover');
        hs.properties.fill = this.am4core.color(this.colorShades[2]);

        // Add event listeners
        homeButton.events.on('hit', () => this.goToHome());
        backButton.events.on('hit', () => this.goToPreviousLevel());
        this.countryTemplate.events.on('hit', (ev) => this.goToPolygon('country', ev.target, ev.target.dataItem.dataContext.id, ev.target.dataItem.dataContext.name));
        this.regionTemplate.events.on('hit', (ev) => this.goToPolygon('region', ev.target, ev.target.dataItem.dataContext.id, ev.target.dataItem.dataContext.name));
      },

      async goToPolygon(type, target, id, name) {
        if (type === 'country') {
          let hasCountryInfo = this.countries.findIndex(c => c.hasOwnProperty('hasInfo') && c.name === name) > -1;
          if (!hasCountryInfo) {
            this.$emit('toast-warning', `There is no data available for ${name}`);
            return;
          }
          // If we switched country, remove the old country's regionSeries geodata, and show the old country again
          if (this.selectedCountry) {
            this.selectedCountry.isActive = false;
            this.countrySeries.getPolygonById(this.selectedCountry.dataItem.dataContext.id).show();
            var regionsGeodata = new Object({ type: 'FeatureCollection', features: [] });
            this.regionSeries.geodata = regionsGeodata;
          }
          // Select the new country
          this.selectedCountry = target;
          this.selectedCountry.isActive = true;
        }

        document.body.style.cursor = 'wait';
        let countryUri = `https://lod.stirdata.eu/nuts/code/${this.getCountryCode(id)}`;
        let regions = await this.$calls.getSubRegions(countryUri);
        var regionsGeodata = new Object({ type: 'FeatureCollection', features: [] });
        Promise.all(
          regions.uris.map((region, index) => {
            return new Promise((resolve) => {
              this.$calls.getCountryGeoJSON(region, regions.names[index], this.getNutsResolution(region.split('/').pop()))
                .then(response => {
                  resolve(response);
                });
            });
          })
        )
          .then(responses => {
            let previousGeodataFeatures = this.regionSeries.geodata ? this.regionSeries.geodata.features : [];
            if (type === 'country') {
              this.countrySeries.getPolygonById(id).hide();
            } else {
              if (this.previousLevel) {
                // If instead of choosing a subregion of the previous region you chose another same-level region, clear the previous region's subregions
                if (id.length !== this.previousLevel.length + 1) {
                  previousGeodataFeatures = previousGeodataFeatures.filter(item => item.id.length <= id.length);
                }
              }
              this.previousLevel = id;
            }
            let newGeodataFeatures = responses.filter(item => !!item).concat(previousGeodataFeatures);
            regionsGeodata.features = newGeodataFeatures;
            this.mapChart.zoomToMapObject(target);
            this.regionSeries.geodata = regionsGeodata;
            this.regionSeries.show();
            document.body.style.cursor = 'default';
          });
      },

      goToPreviousLevel() {
        // If you are in NUT2 level or below, just go back to the previous NUT level
        if (this.previousLevel && this.previousLevel.length >= 4) {
          let previous = this.regionSeries.getPolygonById(this.previousLevel.slice(0, -1));
          this.goToPolygon('region', previous, previous.dataItem.dataContext.id, previous.dataItem.dataContext.name);
        }
        // If you are in NUT1 go the country level
        else if (this.previousLevel && this.previousLevel.length < 4) {
          let previous = this.countrySeries.getPolygonById(this.getCountryCode(this.previousLevel.slice(0, -1)));
          this.goToPolygon('country', previous, previous.dataItem.dataContext.id, previous.dataItem.dataContext.name);
        }
        // If you are in NUT0, go back to Europe
        else {
          this.goToHome();
        }
      },

      goToHome() {
        if (this.selectedCountry) {
          this.selectedCountry.isActive = false;
        }
        this.previousLevel = '';
        let regionsGeodata = new Object({ type: 'FeatureCollection', features: [] });
        this.regionSeries.geodata = regionsGeodata;
        this.countrySeries.getPolygonById(this.selectedCountry.dataItem.dataContext.id).show();

        this.mapChart.goHome();
      },

      getCountryCode(id) {
        if (id === 'GR') {
          return 'EL';
        } else if (id === 'EL') {
          return 'GR';
        } else if (id === 'GB') {
          return 'UK';
        } else if (id === 'UK') {
          return 'GB';
        } else {
          return id;
        }
      },

      getNutsResolution(nutsId) {
        if (nutsId.length <= 2) {
          return '1:10000000';
        } else {
          return '1:3000000';
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  #detailedMap {
    height: calc(100vh - 450px);
    background-color: white;
    width: 100%;
    margin-bottom: 3rem;
  }
</style>
