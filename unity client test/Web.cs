using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Networking;

public class Web : MonoBehaviour
{
    [System.Serializable]
    public struct Data
    {
        public string name;
        public int score;
        public int id;
        public string token;

        public void OnGUI(ref string scoreBuf, ref string idBuf)
        {
            GUILayout.BeginHorizontal();
            GUILayout.Label("Name");
            name = GUILayout.TextField(name);
            GUILayout.EndHorizontal();

            GUILayout.BeginHorizontal();
            GUILayout.Label("Score");
            scoreBuf = GUILayout.TextField(scoreBuf);
            GUILayout.EndHorizontal();

            GUILayout.BeginHorizontal();
            GUILayout.Label("ID");
            idBuf = GUILayout.TextField(idBuf);
            GUILayout.EndHorizontal();

            GUILayout.BeginHorizontal();
            GUILayout.Label("Token");
            token = GUILayout.TextField(token);
            GUILayout.EndHorizontal();


            int value;
            if (int.TryParse(scoreBuf, out value))
            {
                score = value;
                scoreBuf = value.ToString();
            }

            if (int.TryParse(idBuf, out value))
            {
                id = value;
                idBuf = value.ToString();
            }
        }

        public bool Validate()
        {
            if (string.IsNullOrEmpty(name))
            {
                return false;
            }

            if (string.IsNullOrEmpty(token))
            {
                return false;
            }

            if (score < 0)
            {
                return false;
            }

            if (id < 0)
            {
                return false;
            }

            return true;
        }
    }

    [SerializeField]
    private Data m_currentData;

    [SerializeField]
    private string m_url = "url";

    [SerializeField]
    private string m_buffer;

    private string m_scoreBuf = "", m_idBuf = "";

    private string m_message = "";

    private void Awake()
    {
        Screen.fullScreen = false;
    }

    [ContextMenu("Send")]
    public void Send()
    {
        if (!m_currentData.Validate())
        {
            m_message = "Invalid input";
            return;
        }

        m_buffer = JsonUtility.ToJson(m_currentData);
        StartCoroutine(Upload(m_buffer));
    }

    private IEnumerator Upload(string json)
    {
        WWWForm form = new WWWForm();
        form.AddField("json", json);

        m_message = "Seding...";

        UnityWebRequest www = UnityWebRequest.Post(m_url, form);
        yield return www.Send();

        if (www.isError)
        {
            m_message = www.error;
        }
        else
        {
            m_message = www.responseCode.ToString();
        }
    }

    private void OnGUI()
    {
        GUILayout.BeginArea(new Rect(0, 0, Screen.width, Screen.height));

        m_url = GUILayout.TextField(m_url);

        GUILayout.Space(10);

        m_currentData.OnGUI(ref m_scoreBuf, ref m_idBuf);

        if (GUILayout.Button("Send"))
        {
            Send();
        }

        GUI.enabled = false;
        GUILayout.TextArea(m_message);
        GUI.enabled = true;

        GUILayout.EndArea();
    }
}
