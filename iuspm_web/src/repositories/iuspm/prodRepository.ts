import { API_BASE_URL } from "../../config";
import IUSPMRepository from "./repository";

class ProdIUSPMRepository extends IUSPMRepository {

    async getStudents() {
        const myHeaders = new Headers();

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
        };

        const results: any[] = await fetch(`${API_BASE_URL}/base/api/v1/student/`, requestOptions)
            .then((response) => {

                if (response.ok) {
                    return response.json()
                }
                throw new Error("Impossible de recupérer les étudiants " + response.statusText);

            })
            .then((data) => {
                const results: any[] = data.results
                return results.map((e) => {
                    return {
                        uuid: e.id,
                        register: e.register_number,
                        name: e.name,
                        level: e.current_level,
                        sector: e.sector
                    }
                })
            })

        return results
    }

    async getRNGlobal(id: string, year: string) {
        const myHeaders = new Headers();

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
        };

        const results = await fetch(`${API_BASE_URL}/base/api/v1/student/${id}/rn/${year}/`, requestOptions)
            .then((response) => {

                if (response.ok) {
                    return response.blob()
                }
                throw new Error("Impossible de recupérer le relevé (" + response.statusText + ")");
            })
            .then((blob) => window.URL.createObjectURL(blob))

        return results
    }

    async getRNSemester(id: string, year: string, semester: "1" | "2") {
        const myHeaders = new Headers();

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
        };

        const results = await fetch(`${API_BASE_URL}/base/api/v1/student/${id}/rn/${year}/${semester}/`, requestOptions)
            .then((response) => {

                if (response.ok) {
                    return response.blob()
                }
                throw new Error("Impossible de recupérer le relevé (" + response.statusText + ")");
            })
            .then((blob) => window.URL.createObjectURL(blob))

        return results
    }

}

export default ProdIUSPMRepository;