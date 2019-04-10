import React, { Component } from 'react';
import get from "lodash/get";
import { connect } from 'react-redux';
import { LocalForm, Control } from 'react-redux-form';
import moment from "moment";

import { withStyles } from '@material-ui/core/styles';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormGroup from '@material-ui/core/FormGroup';
import FormLabel from '@material-ui/core/FormLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';

import { involvementAction } from "../../../actions/ReSPECT/involvenentAction";
import SystemInformationBlock from "../fragments/SystemInformationBlock";
import MainFormBlock from "../fragments/MainFormBlock";
import SectionToolbar from "../fragments/SectionToolbar";
import InsertedRadioButtonGroup from "../fragments/InsertedRadioButtonGroup";
import { TOTAL_ROWS_NUMBER } from "../statuses";
import { getSectionStatus, getStateData, getFilledValues } from "../functions";
import formStyles from "../fragments/formStyles";

const FORM_FIELDS_NUMBER = 4;

const defaultValues = {
    dateCompleted: moment().format('DD-MMM-YYYY'),
    author: localStorage.getItem('username'),
};

class Involvement extends Component {

    state = {
        isMainPanel: true,
        variant: getStateData(this.props, 'involvement.nonSelectABCreason'),
    };

    submitForm = data => {
        const { variant } = this.state;
        const additionalData = {
            nonSelectABCreason: variant,
            dateCompleted: moment().format('DD-MMM-YYYY'),
        };
        const formData = Object.assign({}, data, additionalData);
        formData.status = getSectionStatus(formData, FORM_FIELDS_NUMBER);
        this.props.addInvolvement(formData);
        const nextStep = (this.props.currentRow > TOTAL_ROWS_NUMBER) ? null : (this.props.currentRow + 1);
        this.props.onRowClick(nextStep);
    };

    togglePanel = () => {
        this.setState({
            isMainPanel: !this.state.isMainPanel,
        });
    };

    handleChange = event => {
        this.setState({ variant: event.target.value });
    };

    render() {
        const { classes, sectionsInfo, latestVersionInfo, involvement, title, onRowClick, isVersionInfo } = this.props;
        const { isMainPanel, variant } = this.state;
        const filledValues = getFilledValues(sectionsInfo, latestVersionInfo, involvement, 'involvement', isVersionInfo, defaultValues);
        const InsertRadioValues = ['at0005', 'at0011', 'at0012'];
        return (
            <React.Fragment>
                <MainFormBlock isMainPanel={isMainPanel} classes={classes} title={title} togglePanel={this.togglePanel}>
                    <LocalForm model="involvement" onSubmit={values => this.submitForm(values)}>
                        <FormGroup className={classes.formGroup}>
                            <FormLabel className={classes.formLabel}>Do that have legal proxy (e.g. welfare attorney, person with parental responsibility who can participate on their behalf in making recommendations?</FormLabel>
                            <RadioGroup name="nonSelectABCreason" className={classes.radioGroup} value={variant} onChange={e => this.handleChange(e)}>
                                <FormControlLabel
                                    className={classes.formControlLabel}
                                    disabled={isVersionInfo}
                                    value="valueSetA"
                                    control={<Radio />}
                                    label="A - This person has the mental capacity to participate in making these recommendations. They have benn fully involved in making this plan."
                                />
                                <FormControlLabel
                                    className={classes.formControlLabel}
                                    disabled={isVersionInfo}
                                    value="valueSetB"
                                    control={<Radio />}
                                    label="B - This person does not have the mental capacity to participate in making these recommendations. This plan has been made in accordance with capacity law, including, where applicable, in consultation with their legal proxy, or where no proxy, with relevant family members / friends."
                                />
                                <FormControlLabel
                                    className={classes.formControlLabel}
                                    disabled={isVersionInfo}
                                    value="valueSetC"
                                    control={<Radio />}
                                    label={
                                        <InsertedRadioButtonGroup
                                            isSelected={variant === 'valueSetC' || InsertRadioValues.indexOf(variant) !== -1}
                                            variant={variant}
                                            isVersionInfo={isVersionInfo}
                                            handleChange={this.handleChange}
                                        />
                                    }
                                />
                                <FormControlLabel
                                    className={classes.formControlLabel}
                                    disabled={isVersionInfo}
                                    value="valueSetD"
                                    control={<Radio />}
                                    label="D - if no other option has been selected, valid reasons must be stated here"
                                />
                            </RadioGroup>
                        </FormGroup>
                        { (variant === 'valueSetD') &&
                            <FormGroup className={classes.formGroup}>
                                <Control.textarea
                                    className={classes.formTextarea}
                                    model="involvement.documentExplanation"
                                    defaultValue={filledValues.documentExplanation}
                                    disabled={isVersionInfo}
                                />
                                <FormHelperText>Document full explanation in the clinical record</FormHelperText>
                            </FormGroup>
                        }
                        <FormGroup className={classes.formGroup}>
                            <FormLabel className={classes.formLabel}>Record date, names and roles of those involved in decision making, and where records of discussion can be found</FormLabel>
                            <Control.textarea
                                className={classes.formTextarea}
                                model="involvement.detailsOfDecision"
                                defaultValue={filledValues.detailsOfDecision}
                                disabled={isVersionInfo}
                            />
                            <FormHelperText>Including diagnosis, communication needs (e.g. interpreter, communication aids) and reasons for the preferences and recomendations recorder.</FormHelperText>
                        </FormGroup>
                        <FormGroup className={classes.formGroup}>
                            <FormLabel className={classes.formLabel}>Date Completed</FormLabel>
                            <Control.text
                                className={classes.formInput}
                                model="involvement.dateCompleted"
                                defaultValue={filledValues.dateCompleted}
                                disabled
                            />
                        </FormGroup>
                        { !isVersionInfo && <SectionToolbar onRowClick={onRowClick} /> }
                    </LocalForm>
                </MainFormBlock>
                <SystemInformationBlock classes={classes} modelName="involvement" filledValues={filledValues} />
            </React.Fragment>
        );
    }
};

const mapStateToProps = state => {
    return {
        involvement: state.custom.involvement.data,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        addInvolvement(data) {
            dispatch(involvementAction.create(data));
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(formStyles)(Involvement));
