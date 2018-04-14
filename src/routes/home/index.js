import { h, Component } from 'preact';
import { route } from 'preact-router';
import style from './style';
import Configurator from '../../components/configurator';
const MULTIPLIER = 1

export default class Home extends Component {

	state = {

		mercuryTick: 4,
		mercuryTheta: 270,
		mercuryX: 0,
		mercuryY: 0,
		mercuryRadius: 1.5* 40,

		venusTick: 3,
		venusTheta: 270,
		venusX: 0,
		venusY: 0,
		venusRadius: 1.5* 60,

		earthTick: 2,
		earthTheta: 270,
		earthX: 0,
		earthY: 0,
		earthRadius: 1.5* 100,

		marsTick: 1.5,
		marsTheta: 270,
		marsX: 0,
		marsY: 0,
		marsRadius: 1.5* 150,

		jupiterTick: 1,
		jupiterTheta: 270,
		jupiterX: 0,
		jupiterY: 0,
		jupiterRadius: 1.5* 200,

		saturnTick: 0.6,
		saturnTheta: 270,
		saturnX: 0,
		saturnY: 0,
		saturnRadius: 1.5* 250,

		patternSource: 'earth',
		patternTarget: 'jupiter',
		lines: [],

		systemRadius: 800
	}

	_getCoords (theta, radius) {
		let y = radius + (radius * Math.sin((theta / 180) * Math.PI));
		let x = radius + (radius * Math.cos((theta / 180) * Math.PI));

		return {x, y};
	}

	_frame() {

		let {
			mercuryTheta,
			mercuryTick,

			venusTheta,
			venusTick,

			earthTheta,
			earthTick,

			marsTheta,
			marsTick,

			jupiterTheta,
			jupiterTick,

			saturnTheta,
			saturnTick

		} = this.state;

		let factor = 4;

		this.setState({
			mercuryTheta: mercuryTheta + ((mercuryTick*MULTIPLIER) / factor),
			venusTheta: venusTheta + ((venusTick*MULTIPLIER) / factor),
			earthTheta: earthTheta + ((earthTick*MULTIPLIER) / factor),
			marsTheta: marsTheta + ((marsTick*MULTIPLIER) / factor),
			jupiterTheta: jupiterTheta + ((jupiterTick*MULTIPLIER) / factor),
			saturnTheta: saturnTheta + ((saturnTick*MULTIPLIER) / factor)
		});
	}

	_snapshot () {

		let {lines} = this.state;
		let c = this._canvasContext;

		let p1 = this.state.patternSource;
		let p2 = this.state.patternTarget;

		let p1Offset = (this.state.systemRadius + 0.4) - this.state[`${p1}Radius`];
		let p2Offset = (this.state.systemRadius + 0.4) - this.state[`${p2}Radius`];

		let p1Point = this._getCoords(this.state[`${p1}Theta`], this.state[`${p1}Radius`]);
		let p2Point = this._getCoords(this.state[`${p2}Theta`], this.state[`${p2}Radius`]);

		lines.push([
			p1Point,
			p2Point
		]);

		c.beginPath();
		c.moveTo(p1Offset + p1Point.x, p1Offset + p1Point.y);
		c.lineTo(p2Offset + p2Point.x, p2Offset + p2Point.y);
		c.stroke();
		c.closePath();

		this.setState({lines});
	}

	startPattern (selectedPlanets, selectedInterval, selectedColor) {

		if (!this._frameTimer) {
			this._frameTimer = setInterval(() => this._frame(), 1);
		}

		this.stopPattern();

		this.state.patternSource = selectedPlanets[0].toLowerCase();
		this.state.patternTarget = selectedPlanets[1].toLowerCase();

		this._canvasContext.strokeStyle = selectedColor.toLowerCase();
		this._canvasContext.lineWidth = 0.8;
		this._patternTimer = setInterval(() => this._snapshot(), Number(selectedInterval) * 100);
	}

	stopPattern () {
		if (this._patternTimer) {
			clearInterval(this._patternTimer);
		}
	}

	clearPattern () {
		this.stopPattern();
		this._canvasContext.clearRect(0,0,this.state.width,this.state.height);
	}

	resetPlanets () {
		if (this._patternTimer) {
			clearInterval(this._patternTimer);
			this._patternTimer = null;
		}

		if (this._frameTimer) {
			clearInterval(this._frameTimer);
			this._frameTimer = null;
		}

		this.setState({
			mercuryTheta: 270,
			venusTheta: 270,
			earthTheta: 270,
			marsTheta: 270,
			jupiterTheta: 270,
			saturnTheta: 270
		});
	}

	componentWillReceiveProps(props) {
		if (props.snapshot) {
			this.exportAsPNG();
			route("/");
		}
	}

	componentDidMount() {
		this._canvasContext = this.canvas.getContext('2d');
		this.canvas.width = this.state.systemRadius * 2;
		this.canvas.height = this.state.systemRadius * 2;
	}

	exportAsPNG() {
		if (this.canvas && this.hiddenLink) {
			let dataURI = this.canvas.toDataURL('png');
			this.hiddenLink.href = dataURI;
			this.hiddenLink.click();
		}
	}

	render() {

		let {
			mercuryRadius,
			venusRadius,
			earthRadius,
			marsRadius,
			jupiterRadius,
			saturnRadius
		} = this.state;

		let mercuryCoords = this._getCoords(this.state.mercuryTheta, mercuryRadius);
		let venusCoords = this._getCoords(this.state.venusTheta, venusRadius);
		let earthCoords = this._getCoords(this.state.earthTheta, earthRadius);
		let marsCoords = this._getCoords(this.state.marsTheta, marsRadius);
		let jupiterCoords = this._getCoords(this.state.jupiterTheta, jupiterRadius);
		let saturnCoords = this._getCoords(this.state.saturnTheta, saturnRadius);

		return (
			<div class={`${style.home}`}>
				<div class={style.buttons}>
					<input class={style.small} type='button' value='Export' onClick={this.exportAsPNG.bind(this)} />
				</div>
				<div class={`${style.centerboth} ${style.solarsystem}`}>
					<canvas ref={canvas => (this.canvas = canvas)}></canvas>
					<div style={{width: mercuryRadius * 2, height: mercuryRadius * 2}} class={`${style.orbit} ${style.mercury} ${style.centerboth}`}>
						<div
							style={{left: mercuryCoords.x, top: mercuryCoords.y}}
							class={`${style.planet} ${style.mercury}`}>
						</div>
					</div>
					<div style={{width: venusRadius * 2, height: venusRadius * 2}} class={`${style.orbit} ${style.venus} ${style.centerboth}`}>
						<div
							style={{left: venusCoords.x, top: venusCoords.y}}
							class={`${style.planet} ${style.venus}`}>
						</div>
					</div>
					<div style={{width: earthRadius * 2, height: earthRadius * 2}} class={`${style.orbit} ${style.earth} ${style.centerboth}`}>
						<div
							style={{left: earthCoords.x, top: earthCoords.y}}
							class={`${style.planet} ${style.earth}`}>
						</div>
					</div>
					<div style={{width: marsRadius * 2, height: marsRadius * 2}} class={`${style.orbit} ${style.mars} ${style.centerboth}`}>
						<div
							style={{left: marsCoords.x, top: marsCoords.y}}
							class={`${style.planet} ${style.mars}`}>
						</div>
					</div>
					<div style={{width: jupiterRadius * 2, height: jupiterRadius * 2}} class={`${style.orbit} ${style.jupiter} ${style.centerboth}`}>
						<div
							style={{left: jupiterCoords.x, top: jupiterCoords.y}}
							class={`${style.planet} ${style.jupiter}`}>
						</div>
					</div>
					<div style={{width: saturnRadius * 2, height: saturnRadius * 2}} class={`${style.orbit} ${style.saturn} ${style.centerboth}`}>
						<div
							style={{left: saturnCoords.x, top: saturnCoords.y}}
							class={`${style.planet} ${style.saturn}`}>
						</div>
					</div>
					<div class={style.sun}></div>
					<a ref={hiddenLink => (this.hiddenLink = hiddenLink)} href="#" style="display:none" download="pattern">Download</a>
				</div>
				<div class={style.configuration}>
					<Configurator layout="auto" start={this.startPattern.bind(this)} stop={this.stopPattern.bind(this)} reset={this.resetPlanets.bind(this)} clear={this.clearPattern.bind(this)} />
				</div>
			</div>
		);
	}
}
