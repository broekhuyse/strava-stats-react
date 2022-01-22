'use strict'

const e = React.createElement

let cid = "48424";
let secret = "71854e4d80bf2f097c7c26266a2001dfd653ea7a";
const token = "fe2e44130c4951f947a154ce69fb4c1c23315a21";
const activityStats = `https://www.strava.com/api/v3/athletes/30580180/stats?access_token=`
const refresh = `https://www.strava.com/oauth/token?client_id=${cid}&client_secret=${secret}&refresh_token=${token}&grant_type=refresh_token`

class StravaStats extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            stats: [],
            userData: []
        };
    }

    componentDidMount() {
        fetch(refresh, {
            method: 'POST',
        })
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        items: result.access_token
                    }, /*() => console.log(result.access_token),*/ sessionStorage.setItem("jwt", result.access_token));
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            )

        fetch('https://www.strava.com/api/v3/athletes/30580180/stats', {
            method: 'GET',
            headers: new Headers({
                'Authorization': 'Bearer ' + sessionStorage.getItem("jwt")
            })
        })
            .then(res => res.json())
            .then(
                (data) => {
                    this.setState({
                        isLoaded: true,
                        stats: data
                    }, () => console.log(data));
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            )

        fetch('https://www.strava.com/api/v3/athlete', {
            method: 'GET',
            headers: new Headers({
                'Authorization': 'Bearer ' + sessionStorage.getItem("jwt")
            })
        })
            .then(res => res.json())
            .then(
                (data) => {
                    this.setState({
                        isLoaded: true,
                        userData: data
                    }, () => console.log(data));
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            )

    }

    render() {
        const { error, isLoaded, stats, userData } = this.state;
        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            return [
                <span>
                    <p key={1}>{userData.firstname} {userData.lastname}</p>,
                    <img key={3} src={userData.profile}></img>
                </span>
            ]
        }
    }
}

const domContainer = document.querySelector('#strava_stats');
ReactDOM.render(e(StravaStats), domContainer);