import { connect } from 'react-redux';
// import { bindActionCreators } from 'redux';
import Scatch from './Scatch';
// import { authActions as appAuth} from '@app/store/appAuth';
import { sketchResetItems } from '../../actions/sketch';
/**
 * mapStateToProps is word for promise
 * this function will connect state in redux to component props
 * @param {*} state state variable in reudx
 */
const mapStateToProps = (state) => ({
    basket: state.sketch.list
});
/**
 * mapStateToProps is word for promise
 * this function will connect state in redux to component props
 * @param {*} state state variable in reudx
 */
const mapDispatchToProps = (dispatch) => ({
    sketchResetItems: () => dispatch(sketchResetItems())
})

export default connect(mapStateToProps, mapDispatchToProps)(Scatch);
