export interface Dataset {
    id: string
    name: string
    emoji: string
    domain: string
    difficulty: 'Beginner' | 'Intermediate'
    description: string
    scenario: string   // what the "mission" is
    data: string       // text data to analyze (logs, configs, etc.)
    columns: string
}

export const DATASETS: Dataset[] = [
    {
        id: 'access-logs',
        name: 'Suspicious Access Logs',
        emoji: '🔍',
        domain: 'Log Analysis',
        difficulty: 'Beginner',
        description: 'Analyze server access logs to identify suspicious activity and potential intrusion attempts.',
        scenario: 'A server has been behaving oddly. Your manager hands you the access logs and asks you to find anything suspicious.',
        columns: 'timestamp, ip_address, method, endpoint, status_code, bytes, user_agent',
        data: `timestamp,ip_address,method,endpoint,status_code,bytes,user_agent
2024-03-15 08:12:01,192.168.1.10,GET,/index.html,200,1024,Mozilla/5.0
2024-03-15 08:12:45,192.168.1.10,GET,/about.html,200,890,Mozilla/5.0
2024-03-15 08:15:22,10.0.0.55,GET,/admin/login,200,2048,Mozilla/5.0
2024-03-15 08:15:23,10.0.0.55,POST,/admin/login,401,512,Mozilla/5.0
2024-03-15 08:15:24,10.0.0.55,POST,/admin/login,401,512,Mozilla/5.0
2024-03-15 08:15:25,10.0.0.55,POST,/admin/login,401,512,Mozilla/5.0
2024-03-15 08:15:26,10.0.0.55,POST,/admin/login,401,512,Mozilla/5.0
2024-03-15 08:15:27,10.0.0.55,POST,/admin/login,200,4096,Mozilla/5.0
2024-03-15 08:20:11,185.234.219.10,GET,/wp-admin,404,256,sqlmap/1.7
2024-03-15 08:20:12,185.234.219.10,GET,/phpmyadmin,404,256,sqlmap/1.7
2024-03-15 08:20:13,185.234.219.10,GET,/admin.php,404,256,sqlmap/1.7
2024-03-15 08:20:14,185.234.219.10,GET,/login.php?id=1%27,400,256,sqlmap/1.7
2024-03-15 08:25:00,192.168.1.45,GET,/dashboard,200,3200,Mozilla/5.0
2024-03-15 09:01:00,10.0.0.55,GET,/admin/users,200,8192,Mozilla/5.0
2024-03-15 09:02:00,10.0.0.55,GET,/admin/export-all-data,200,204800,Mozilla/5.0`,
    },
    {
        id: 'network-scan',
        name: 'Network Traffic Analysis',
        emoji: '📡',
        domain: 'Network Security',
        difficulty: 'Beginner',
        description: 'Review network connection data to spot unusual traffic patterns and potential threats.',
        scenario: 'The IT team flagged unusual outbound traffic. You need to analyze the connection logs and write a report.',
        columns: 'time, src_ip, dst_ip, dst_port, protocol, bytes_sent, bytes_recv, flag',
        data: `time,src_ip,dst_ip,dst_port,protocol,bytes_sent,bytes_recv,flag
08:00:01,10.0.1.5,8.8.8.8,53,UDP,64,128,normal
08:00:05,10.0.1.10,216.58.214.14,443,TCP,1024,8192,normal
08:00:10,10.0.1.15,10.0.1.1,22,TCP,256,512,normal
08:01:00,10.0.1.20,185.220.101.5,4444,TCP,50000,200,suspicious
08:01:01,10.0.1.20,185.220.101.5,4444,TCP,60000,200,suspicious
08:01:02,10.0.1.20,185.220.101.5,4444,TCP,70000,200,suspicious
08:02:00,10.0.1.8,10.0.1.1,80,TCP,128,4096,normal
08:02:30,10.0.1.25,192.168.50.1,23,TCP,64,64,suspicious
08:03:00,10.0.1.30,10.0.2.0,445,TCP,2048,0,suspicious
08:03:01,10.0.1.30,10.0.2.1,445,TCP,2048,0,suspicious
08:03:02,10.0.1.30,10.0.2.2,445,TCP,2048,0,suspicious
08:03:03,10.0.1.30,10.0.2.3,445,TCP,2048,0,suspicious
08:05:00,10.0.1.5,1.1.1.1,53,UDP,64,128,normal
08:10:00,10.0.1.20,185.220.101.5,4444,TCP,1048576,500,suspicious`,
    },
    {
        id: 'password-audit',
        name: 'Password Policy Audit',
        emoji: '🔐',
        domain: 'Access Control',
        difficulty: 'Intermediate',
        description: 'Audit a list of hashed passwords and user data to identify weak security practices.',
        scenario: 'After a mock internal audit, you have a sanitized export of user account metadata. Find security issues and recommend fixes.',
        columns: 'user_id, username, role, last_login_days_ago, failed_logins, mfa_enabled, password_age_days, account_locked',
        data: `user_id,username,role,last_login_days_ago,failed_logins,mfa_enabled,password_age_days,account_locked
1,admin,admin,2,0,false,365,false
2,jsmith,user,1,2,true,45,false
3,guest,guest,180,0,false,730,false
4,dbadmin,admin,5,0,false,400,false
5,mary.jones,user,3,0,true,30,false
6,temp_user,user,400,0,false,800,true
7,backup_svc,service,0,15,false,600,false
8,ceo,executive,10,0,false,200,false
9,intern01,user,2,8,false,10,false
10,sysadmin,admin,1,0,false,180,false
11,test_account,user,700,0,false,1000,false
12,sarah.k,user,1,0,true,25,false
13,old_employee,user,500,0,false,1200,true
14,root,admin,30,5,false,450,false
15,api_service,service,0,0,false,720,false`,
    },
]

export function getDataset(id: string): Dataset | undefined {
    return DATASETS.find((d) => d.id === id)
}