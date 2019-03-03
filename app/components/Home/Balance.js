import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, TouchableHighlight } from 'react-native';
import PropTypes from 'prop-types';

class Balance extends Component {
	constructor(props) {
		super(props);
	}

	onClickWithdraw = (e) => {
		console.warn('onClickWithdraw')
	}

	render() {
		const { balance } = this.props.userState.data;
		return (
			<View style={styles.container}>
				<View style={styles.balanceContainer}>
					<View style={styles.balance}>
						<Text style={styles.balanceText}>{balance}</Text>
					</View>
					<View style={styles.currency}>
						<Image style={styles.currencyImg} source={require('../../assets/ruble.png')}/>
					</View>
				</View>
				<View style={styles.withdraw}>
					<TouchableHighlight
						onPress={this.onClickWithdraw}
						underlayColor={'transparent'}>
						<Text style={styles.withdrawText}>Получить деньги</Text>
					</TouchableHighlight>
				</View>
			</View>
		);
	}
}

// component styles
const styles = StyleSheet.create({
	container: {
		marginTop: 20,
		height: 100,
		justifyContent: 'center',
		alignSelf: 'center'
	},
	balanceContainer: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'center'
	},
	balance: {
		flex: 0,
		marginRight: 10
	},
	balanceText: {
		fontSize: 35,
		color: '#474747',
	},
	currency: {
		flex: 0
	},
	currencyImg: {
		width: 22,
		height: 30,
		marginTop: 9,
	},
	withdraw: {
		flex: 1
	},
	withdrawText: {
		textAlign: 'center'
	}
});

// component prop types
Balance.propTypes = {
	userState: PropTypes.object.isRequired
};

export default Balance;
