import axios from "axios";
import config from "../src/config/index.js";
import { users } from "../src/mock/data.js";
import Promise from "bluebird";

const basePath = `/schema/${config.permit.projectId}/${config.permit.envId}`;


const assignmentPath = `/facts/${config.permit.projectId}/${config.permit.envId}/role_assignments`;
const resourceRolePath = `${basePath}/resources/account/roles`;
const resourceInstancePath = `facts/${config.permit.projectId}/${config.permit.envId}/resource_instances`;


const globalRoles = ["admin"];
const resourceRoles = ["sales_rep", "support", "customer", "ai_agent"];
const resourceTypes = ["account"];

const permitApi = axios.create({
  baseURL: config.permit.apiBaseUrl,
  headers: {
    Authorization: `Bearer ${config.permit.apiKey}`,
    "Content-Type": "application/json",
  },
});

async function setupRolesAndResourceTypes() {
  console.log("🔧 Creating roles and resource types...");

  await Promise.map(globalRoles, async (role) => {
    try {
      await permitApi.post(`${basePath}/roles`, {
        key: role,
        name: role,
      });
      console.log(`✅ Created global role '${role}'`);
    } catch (err) {
      if (err.response?.data?.error_code === "DUPLICATE_ENTITY") {
        console.log(`↪️  Global role '${role}' already exists. Skipping.`);
      } else {
        throw err;
      }
    }
  });

  await Promise.map(resourceRoles, async (role) => {
    try {
      await permitApi.post(`${resourceRolePath}`, {
        key: role,
        name: role,
      });
      console.log(`✅ Created resource-scoped role '${role}'`);
    } catch (err) {
      if (err.response?.data?.error_code === "DUPLICATE_ENTITY") {
        console.log(`↪️  Resource role '${role}' already exists. Skipping.`);
      } else {
        throw err;
      }
    }
  });

  await Promise.map(resourceTypes, async (resourceKey) => {
    try {
      await permitApi.post(`${basePath}/resources`, {
        key: resourceKey,
        name: resourceKey.charAt(0).toUpperCase() + resourceKey.slice(1),
        actions: { read: {}, edit: {}, create: {}, delete: {} },
      });
      console.log(`✅ Created resource type '${resourceKey}'`);
    } catch (err) {
      if (err.response?.data?.error_code === "DUPLICATE_ENTITY") {
        console.log(`↪️  Resource type '${resourceKey}' already exists. Skipping.`);
      } else {
        throw err;
      }
    }
  });
}

async function syncUsersAndRoles() {
  console.log("👥 Syncing users and role assignments...");

  await Promise.map(users, async (user) => {
    const userKey = user.id.toString();
    try {
      await permitApi.post(assignmentPath, {
        user: userKey,
        role: user.role,
        tenant: "default",
      });
      console.log(`🔗 Assigned '${user.role}' role to user '${userKey}' globally.`);
    } catch (err) {
      if (err.response?.data?.error_code === "DUPLICATE_ENTITY") {
        console.log(`↪️  Global role assignment for '${userKey}' already exists.`);
      } else {
        throw err;
      }
    }

    const syncResources = [];

    if (user.role === "sales_rep") {
      for (const accountId of user.assigned_accounts || []) {
        const key = `${accountId}`;
        syncResources.push(
          permitApi.post(resourceInstancePath, {
            key,
            resource: "account",
            tenant: "default",
            attributes: { assigned_to: userKey },
          }).catch((err) => {
            if (err.response?.data?.error_code !== "DUPLICATE_ENTITY") throw err;
            console.log(`↪️  Resource '${key}' already exists.`);
          })
        );

        syncResources.push(
          permitApi.post(assignmentPath, {
            user: userKey,
            role: user.role,
            tenant: "default",
            resource_instance: `account:${key}`,
          })
        );
      }
    }

    if (user.role === "customer") {
      const key = `${user.account_id}`;
      syncResources.push(
        permitApi.post(resourceInstancePath, {
          key,
          resource: "account",
          tenant: "default",
          attributes: { owned_by: userKey },
        }).catch((err) => {
          if (err.response?.data?.error_code !== "DUPLICATE_ENTITY") throw err;
          console.log(`↪️  Resource '${key}' already exists.`);
        })
      );

      syncResources.push(
        permitApi.post(assignmentPath, {
          user: userKey,
          role: user.role,
          tenant: "default",
          resource_instance: `account:${key}`,
        }).catch((err) => {
          if (err.response?.data?.error_code !== "DUPLICATE_ENTITY") throw err;
          console.log(`↪️  Role assignment for '${userKey}' on 'account:${key}' already exists.`);
        })
      );
    }

    await Promise.all(syncResources);
  }, { concurrency: 5 });
}


export default async function seedPermitData() {
  await setupRolesAndResourceTypes();
  await syncUsersAndRoles();
}
