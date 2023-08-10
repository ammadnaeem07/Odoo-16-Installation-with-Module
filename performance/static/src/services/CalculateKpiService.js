/** @odoo-module */

import { registry } from "@web/core/registry"
const { reactive } = owl

export const calculateKpiService = {
    start(){
        function normalFunction(){
            return "This is a normal function"
        }

        return {
            'func' : normalFunction(),
        }
    }

}
registry.category("services").add("calculateKpiService", calculateKpiService)