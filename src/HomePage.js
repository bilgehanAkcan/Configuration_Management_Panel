import React, { useEffect, useState } from 'react';
import 'firebase/auth';
import CompanyLogo from '../src/images/CodewayLogo.png';
import { PiUserCircleGearBold } from "react-icons/pi";
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import EditPopup from './EditPopup';

const HomePage = () => {
	const [showProfile, setShowProfile] = useState(false);
	const [configurations, setConfigurations] = useState([{}]);
	const [newParameter, setNewParameter] = useState("");
	const [value, setValue] = useState("");
	const [newDescription, setNewDescription] = useState("");
	const [showPopup, setShowPopup] = useState(false);
	const [configurationId, setConfigurationId] = useState("");
	const [passedParameterKey, setPassedParameterKey] = useState("");
	const [passedValue, setPassedValue] = useState("");
	const [passedDescription, setPassedDescription] = useState("");
	const [loading, setLoading] = useState(false);
	const [idToken, setIdToken] = useState("");
	const auth = getAuth();
	const navigate = useNavigate();

	const handleSignOut = () => {
		signOut(auth).then(() => {
			console.log("The user signed out");
			navigate('/signin')
		}).catch((error) => {
			console.log(error.message);
		});
	}

	useEffect(() => {
		if (auth.currentUser === null) {
			console.log("here");
			navigate('/signin')
		}
		else {
			onAuthStateChanged(auth, async (user) => {
				if (user) {
					try {
						const token = await user.getIdToken();
						setIdToken(token);
						console.log(token);
					} catch (error) {
						console.error("Error getting ID token:", error);
						setIdToken("");
					}
				}
			})
			axios.get('/configurations').then((response) => {
				setConfigurations(response.data);
				setLoading(true);
			}).catch(err => {
				console.error(err);
			})
		}
	}, []);

	const addConfiguration = () => {
		const configParameter = newParameter;
		const configValue = value;
		const configDescription = newDescription;
		const body = { configParameter, configValue, configDescription };
		axios.post('/modify', body).then((response) => {
			console.log('Post request successful!', response.data);
			setNewDescription("");
			setNewParameter("");
			setValue("");
			setConfigurations([...configurations, response.data]);
		}).catch((error) => {
			console.error('Post request failed:', error);
		});

	}

	const deleteConfiguration = (id) => {
		const config = {
			headers: {
				Authorization: idToken
			},
		}
		axios.delete('/modify/' + id, config).then((response) => {
			console.log('Delete request successful!', response.data);
			setConfigurations(configurations.filter((config) => config.id !== id))
		}).catch(error => {
			console.error('Delete request failed!', error);
		})
	}

	return (
		<div>
			{loading ?
				<div className="home-container">
					<div className="header">
						<img src={CompanyLogo} className="home-page-logo" />
						<div className="profile-icon" onClick={() => setShowProfile(!showProfile)}>
							<PiUserCircleGearBold size={30} />
							{showProfile && (
								<div className="profile-dropdown">
									<center><p style={{ color: "black" }}>{auth.currentUser.email}</p></center>
									<button className='sign-out-button' onClick={handleSignOut}>Sign Out</button>
								</div>
							)}
						</div>
					</div>
					<div className="table-container">
						<table>
							<thead>
								<tr>
									<th className='home-page-th'>Parameter Key</th>
									<th className='home-page-th'>Value</th>
									<th className='home-page-th'>Description</th>
									<th className='home-page-th'>Create Date</th>
									<th></th>
								</tr>
							</thead>
							<tbody>
								{configurations.map((configuration) => {
									console.log(configuration);
									return (
										<tr>
											<td className='home-page-td'>{configuration.parameterKey}</td>
											<td className='home-page-td'>{configuration.value}</td>
											<td className='home-page-td'>{configuration.description}</td>
											<td className='home-page-td'>{new Date(configuration.createDate?._seconds * 1000).toLocaleString()}</td>
											<td className='home-page-td'>
												<button type="button" class="btn btn-primary" onClick={() => {setConfigurationId(configuration.id); setPassedParameterKey(configuration.parameterKey); setPassedDescription(configuration.description); setPassedValue(configuration.value); setShowPopup(true); }}>Edit</button>&emsp;
												<button type="button" class="btn btn-danger" onClick={() => deleteConfiguration(configuration.id)}>Delete</button>
											</td>
										</tr>
									);
								})}
								<tr>
									<td className='home-page-td'><input type="parameter" placeholder="New Parameter" className='form-control' value={newParameter} onChange={(e) => setNewParameter(e.target.value)} /></td>
									<td className='home-page-td'><input type="value" placeholder="Value" className='form-control' value={value} onChange={(e) => setValue(e.target.value)} /></td>
									<td className='home-page-td' colSpan="2"><input type="description" placeholder="New Description" className='form-control' value={newDescription} onChange={(e) => setNewDescription(e.target.value)} /></td>
									<td className='home-page-td'><button type="button" className="btn btn-info" onClick={() => {addConfiguration()}}>ADD</button></td>
								</tr>
							</tbody>
						</table>
					</div>
				</div> : <div className="loading-container"><div className="loading-spinner"></div></div>}
			<EditPopup showPopup={showPopup} setShowPopup={setShowPopup} configurationId={configurationId} configurations={configurations} setConfigurations={setConfigurations} passedDescription={passedDescription} passedParameterKey={passedParameterKey} passedValue={passedValue} idToken={idToken}></EditPopup>
		</div>
	);
}

export default HomePage;
