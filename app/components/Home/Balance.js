import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, TouchableHighlight } from 'react-native';
import PropTypes from 'prop-types';
import { withNavigation } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

class Balance extends Component {
	constructor(props) {
		super(props);
	}

	onClickWithdraw = (e) => {
		this.props.navigation.navigate('Withdraw');
	}

	render() {
		const { balance } = this.props.userState.data;
		return (
			<View style={styles.container}>
				<View style={styles.balanceContainer}>
					<Text style={styles.balanceText}>{balance.toFixed(2)} <Icon size={35} name="currency-rub" color="#474747"/></Text>
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
	},
	balanceText: {
		fontSize: 35,
		color: '#474747',
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

export default withNavigation(Balance);
