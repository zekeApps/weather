var Counter =(function(){
	var _privateCounter = 0;

	function _changeVal(val)  {
		_privateCounter += val;
	};

	return {
		inc: function() {
			_changeVal(1);
		},
		dec: function(){
			_changeVal(-1);
		},
		val: function(){
			return _privateCounter;
		}

	};
})();