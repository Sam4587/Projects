Component({
  properties: {
    iconType: {
      type: String,
      value: 'calculator'
    },
    text: {
      type: String,
      value: ''
    },
    active: {
      type: Boolean,
      value: false
    }
  },
  methods: {
    onTap() {
      this.triggerEvent('tabclick', {
        iconType: this.properties.iconType
      });
    }
  }
});