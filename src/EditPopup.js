import React from "react";
import { useState } from "react";
import axios from 'axios';

function EditPopup(props) {
	const [parameterKey, setParameterKey] = useState(props.passedParameterKey);
	const [value, setValue] = useState(props.passedValue);
	const [description, setDescription] = useState(props.passedDescription);
	
	const editConfiguration = (id) => {
		const config = {
			headers: {
				Authorization: props.idToken
			},
		}
		const data = {
			parameterKey: parameterKey !== "" ? parameterKey : props.passedParameterKey,
			value: value !== "" ? value : props.passedValue,
			description: description !== "" ? description : props.passedDescription
		}
		axios.put('/modify/' + id, data, config).then((response) => {
			props.setConfigurations(props.configurations.map((config) => config.id === id ? response.data : config));
			setParameterKey("");
			setValue("");
			setDescription("");
			props.setShowPopup(false);
		}).catch(error => {
			console.error('Delete request failed!', error);
		})
	}


	function displayPopup() {
		return (
			<div className="popup">
				<div className="popup-inner">
					<br></br>
					<center>
						<table>
							<tr>
								<td><input className='form-control' placeholder={props.passedParameterKey} onChange={(e) => { setParameterKey(e.target.value) }} /></td>
								<td><input className='form-control' placeholder={props.passedValue} onChange={(e) => { setValue(e.target.value) }} /></td>
								<td><input className='form-control' placeholder={props.passedDescription} onChange={(e) => { setDescription(e.target.value) }} /></td>
							</tr>
						</table>
						<br></br>
						<button type="button" class="btn btn-success" onClick={() => { editConfiguration(props.configurationId) }}>Save</button>&emsp;
						<button type="button" class="btn btn-danger" onClick={() => { props.setShowPopup(false) }}>Close</button>
					</center>
				</div>
			</div>
		);
	}

	return (
		<div>
			{props.showPopup ? displayPopup() : null}
		</div>
	);
}

export default EditPopup;